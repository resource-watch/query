const Router = require('koa-router');
const logger = require('logger');
const fs = require('fs-promise');
const request = require('request');
const requestPromise = require('request-promise');
const Storage = require('@google-cloud/storage');
const QueryService = require('services/query.service');
const passThrough = require('stream').PassThrough;
const Jiminy = require('jiminy');
const jiminyConfig = require('./jiminy.config');

const router = new Router();
const charts = ['bar', 'line', 'pie', 'scatter', '1d_scatter', '1d_tick'];

function getHeadersFromResponse(response) {
    const validHeaders = {};
    const keys = Object.keys(response.headers);
    for (let i = 0, { length } = keys; i < length; i++) {
        validHeaders[keys[i]] = response.headers[keys[i]];
    }
    logger.debug('Valid-headers', validHeaders);
    return validHeaders;
}

class QueryRouter {

    static async freeze(options) {
        const nameFile = `${Date.now()}.json`;
        try {
            logger.debug('Obtaining data');
            const data = await requestPromise(options);
            await fs.writeFile(`/tmp/${nameFile}`, JSON.stringify(data));

            const storage = new Storage();
            // uploading
            logger.debug('uploading file');
            await storage
                .bucket(process.env.BUCKET_FREEZE)
                .upload(`/tmp/${nameFile}`);
            logger.debug('making public');
            const file = await storage
                .bucket(process.env.BUCKET_FREEZE)
                .file(nameFile)
                .makePublic();
            logger.debug('file', file);
            return `https://storage.googleapis.com/${process.env.BUCKET_FREEZE}/${nameFile}`;
        } catch (err) {
            logger.error(err);
            throw err;
        } finally {
            try {
                const exists = await fs.stat(`/tmp/${nameFile}`);
                if (exists) {
                    await fs.unlink(`/tmp/${nameFile}`);
                }
                // eslint-disable-next-line no-empty
            } catch (err) {}
        }
    }

    static async query(ctx) {
        logger.info('Doing query');

        const options = await QueryService.getTargetQuery(ctx, ctx.path.split('/')[1]);
        logger.debug('Doing request to adapter', options);
        if (!ctx.query.freeze || ctx.query.freeze !== 'true') {
            const req = request(options);
            req.on('response', (response) => {
                ctx.response.status = response.statusCode;
                ctx.set(getHeadersFromResponse(response));
            });
            ctx.body = req.on('error', ctx.onerror).pipe(passThrough());
        } else {
            let { loggedUser } = ctx.request.body;
            if (!loggedUser && ctx.query.loggedUser) {
                loggedUser = JSON.parse(ctx.query.loggedUser);
            }
            if (!loggedUser) {
                ctx.throw(401, 'Not authenticated');
                return;
            }
            try {
                const url = await QueryRouter.freeze(options);
                ctx.body = {
                    url
                };
            } catch (err) {
                if (err.statusCode) {
                    ctx.throw(err.statusCode, err.details);
                    return;
                }
                ctx.throw(500, 'Internal server error');
            }
        }
    }

    static async jiminy(ctx) {
        logger.info('Doing jiminy');
        try {

            const options = await QueryService.getTargetQuery(ctx, 'query');
            const fields = QueryService.getFieldsOfSql(ctx);
            options.simple = true;
            options.resolveWithFullResponse = false;
            const body = await requestPromise(options);

            const jiminy = new Jiminy(body.data, jiminyConfig);
            const response = {};

            response.general = jiminy.recommendation();
            response.byColumns = {};
            for (let i = 0, { length } = fields; i < length; i++) {
                const column = fields[i].alias || fields[i].value;
                response.byColumns[column] = jiminy.recommendation([column]);
            }
            response.byType = {};
            for (let i = 0, { length } = charts; i < length; i++) {
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
router.post('/query/:dataset', QueryRouter.query);

router.post('/download', QueryRouter.query);
router.post('/download/:dataset', QueryRouter.query);

router.get('/jiminy', QueryRouter.jiminy);
router.post('/jiminy', QueryRouter.jiminy);


module.exports = router;
