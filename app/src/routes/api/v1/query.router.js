const Router = require('koa-router');
const logger = require('logger');
const request = require('request');
const Sql2json = require('sql2json').sql2json;
const Json2sql = require('sql2json').json2sql;
const ctRegisterMicroservice = require('ct-register-microservice-node');

const passThrough = require('stream').PassThrough;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var deserializer = function (obj) {
    return new Promise((resolve, reject) => {
        new JSONAPIDeserializer({
            keyForAttribute: 'camelCase'
        }).deserialize(obj, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

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

const containApps = function(apps1, apps2) {
    if (!apps1 || !apps2){
        return false;
    }
    for (let i = 0, length = apps1.length; i < length; i++) {
        for (let j = 0, length2 = apps2.length; j < length2; j++){
            if (apps1[i] === apps2[j]){
                return true;
            }
        }
    }
    return false;
};


const checkUserHasPermission = function(user, dataset) {
    if (user && dataset) {        
         // check if user is admin of any application of the dataset or manager and owner of the dataset
        if (user.role === 'MANAGER' && user.id === dataset.userId){
            return true;
        } else  if (user.role === 'ADMIN' && containApps(dataset.application, user.extraUserData ? user.extraUserData.apps : null)) {
            return true;
        }
        
    }
    return false;
};


class QueryRouter {    

    static checkRoles(dataset, loggedUser){
        if (checkUserHasPermission(loggedUser, dataset)){
            return true;
        }
        return false;       
    }

    static async query(ctx) {
        logger.info('Doing query');
        logger.debug('Checking if query ');
        const sql = ctx.query.sql || ctx.request.body.sql;
        const tableName = ctx.query.tableName || ctx.request.body.tableName;
        let parsed = null;
        if (!sql && !tableName) {
            ctx.throw(400, 'Sql o FS required');
            return;
        }
        let datasetId = tableName;
        if (sql) {
            parsed = new Sql2json(sql).toJSON();
            datasetId = parsed.from.replace(/"/g, '').replace(/\'/g, '');
        }

        logger.debug('Obtaining dataset');
        let dataset = null;
        try {
            logger.debug('Obtaining dataset with id/slug', datasetId);
            dataset = await ctRegisterMicroservice.requestToMicroservice({
                uri: `/dataset/${datasetId}`,
                json: true,
                method: 'GET'
            });
            logger.debug('Dataset obtained correctly', dataset);
            dataset = await deserializer(dataset);
        } catch (err) {
            logger.error('Error obtaining dataset', err);
            if (err.status === 404) {
                ctx.throw(404, 'Dataset not found');
                return;
            }
            ctx.throw(500, err.message);
            return;
        }

        if (parsed && parsed.delete) {
            if (!QueryRouter.checkRoles(dataset, ctx.request.body.loggedUser)){
                ctx.throw(403, 'Not authorized to execute DELETE query');
                return;
            }
        }

        let body = null;
        let qs = null;
        if (sql) {
            parsed.from = dataset.tableName;
            const newSql = Json2sql.toSQL(parsed);

            if (ctx.method === 'GET') {
                qs = Object.assign({}, ctx.query, {
                    sql: newSql
                });
            } else {
                body = Object.assign({}, ctx.query, ctx.request.body, {
                    sql: newSql
                });
            }
        } else {
            tableName = dataset.tableName;
            if (ctx.method === 'GET') {
                qs = Object.assign({}, ctx.query, {
                    tableName
                });
            } else {
                body = Object.assign({}, ctx.query, ctx.request.body, {
                    tableName
                });
            }
        }
        logger.debug('ctx', ctx.path);
        let options = {
            uri: `${process.env.CT_URL}/${process.env.API_VERSION}${ctx.path}/${dataset.id}`,
            simple: false,
            resolveWithFullResponse: true,
            json: true
        };
        if (ctx.method === 'GET'){
            delete qs.loggedUser;
            options.qs = qs;
            options.method = 'GET';
        } else {
            delete body.loggedUser;
            options.body = body;
            options.method = 'POST';
        }
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
