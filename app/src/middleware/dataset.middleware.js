const logger = require('logger');
const DatasetService = require('services/datasetService');

class DatasetMiddleware {

    static async getDatasetById(ctx, next) {
        const datasetId = ctx.params.dataset;
        logger.debug('[DatasetRouter - getDatasetById] - Dataset id', datasetId);

        if (!datasetId) {
            ctx.throw(400, 'Invalid request');
        }

        const dataset = await DatasetService.getDatasetById(datasetId, ctx.request.headers['x-api-key']);

        if (!dataset) {
            ctx.throw(404, 'Dataset not found');
        }

        ctx.request.query.dataset = {
            id: dataset.id,
            ...dataset.attributes
        };

        await next();
    }

}

module.exports = DatasetMiddleware;
