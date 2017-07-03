const Router = require('koa-router');
const logger = require('logger');
const request = require('request');
const requestPromise = require('request-promise');
const QueryService = require('services/query.service');
const passThrough = require('stream').PassThrough;
const Jiminy = require('jiminy');

const router = new Router();

const jiminyConfig = require('./jiminy.config');
const charts = ['bar', 'line', 'pie', 'scatter', '1d_scatter', '1d_tick'];

function getHeadersFromResponse(response) {
    const validHeaders = {};
    const keys = Object.keys(response.headers);
    for (let i = 0, length = keys.length; i < length; i++) {
        validHeaders[keys[i]] = response.headers[keys[i]];
    }
    logger.debug('Valid-headers', validHeaders);
    return validHeaders;
}

class QueryRouter {

    static async query(ctx) {
        logger.info('Doing query');
        const options = await QueryService.getTargetQuery(ctx);
        logger.debug('Doing request to adapter', options);

        const req = request(options);
        req.on('response', (response) => {
            ctx.response.status = response.statusCode;
            ctx.set(getHeadersFromResponse(response));
        });
        ctx.body = req.on('error', ctx.onerror).pipe(passThrough());

    }

    static async jiminy(ctx) {
        logger.info('Doing jiminy');
        try {

            const options = await QueryService.getTargetQuery(ctx);
            const fields = QueryService.getFieldsOfSql(ctx);
            options.simple = true;
            options.resolveWithFullResponse = false;
            const body = await requestPromise(options);

            const jiminy = new Jiminy(body.data, jiminyConfig);
            const response = {};

            response.general = jiminy.recommendation();
            response.byColumns = {};
            for (let i = 0, length = fields.length; i < length; i++) {
                const column = fields[i].alias || fields[i].value;
                response.byColumns[column] = jiminy.recommendation([column]);
            }
            response.byType = {};
            for (let i = 0, length = charts.length; i < length; i++) {
                response.byType[charts[i]] = {
                    general: jiminy.columns(charts[i]),
                    columns: {}
                };
                for (let j = 0, lengthColumns = fields.length; j < lengthColumns; j++) {
                    const column = fields[j].alias || fields[j].value;
                    response.byType[charts[i]].columns[column] = jiminy.columns(charts[i], column);
                }

            }
            ctx.body = {
                data: response
            };

        } catch (err) {
            logger.error(err);
        }

    }

}

router.post('/query', QueryRouter.query);
router.post('/download', QueryRouter.query);
router.get('/jiminy', QueryRouter.jiminy);
router.post('/jiminy', QueryRouter.jiminy);


module.exports = router;
