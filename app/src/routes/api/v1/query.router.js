const Router = require('koa-router');
const logger = require('logger');
const request = require('request');
const QueryService = require('services/query.service');
const passThrough = require('stream').PassThrough;


const router = new Router();

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

}

router.post('/query', QueryRouter.query);
router.post('/download', QueryRouter.query);


module.exports = router;
