const logger = require('logger');

const Sql2json = require('sql2json').sql2json;
const Json2sql = require('sql2json').json2sql;
const ctRegisterMicroservice = require('ct-register-microservice-node');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
const ValidationError = require('errors/validation.error');
const QueryParsingError = require('errors/queryParsing.error');
const endpoints = require('services/endpoints');

const deserializer = (obj) => new Promise((resolve, reject) => {
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

const containApps = (apps1, apps2) => {
    if (!apps1 || !apps2) {
        return false;
    }
    for (let i = 0, { length } = apps1; i < length; i++) {
        for (let j = 0, length2 = apps2.length; j < length2; j++) {
            if (apps1[i] === apps2[j]) {
                return true;
            }
        }
    }
    return false;
};


const checkUserHasPermission = (user, dataset) => {
    if (user && dataset) {
        // check if user is admin of any application of the dataset or manager and owner of the dataset
        if (user.role === 'MANAGER' && user.id === dataset.userId) {
            return true;
        }
        if (user.role === 'ADMIN' && containApps(dataset.application, user.extraUserData ? user.extraUserData.apps : null)) {
            return true;
        }
    }
    return false;
};


const generateTemplateString = (function () {
    const cache = {};

    function generateTemplate(template) {

        let fn = cache[template];

        if (!fn) {

            // Replace ${expressions} (etc) with ${map.expressions}.

            const sanitized = template
                // eslint-disable-next-line no-useless-escape
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, (_, match) => `\$\{map.${match.trim()}\}`)
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            // eslint-disable-next-line no-new-func
            fn = Function('map', `return \`${sanitized}\``);

        }

        return fn;
    }

    return generateTemplate;
}());

class QueryService {

    static checkRoles(dataset, loggedUser) {
        if (checkUserHasPermission(loggedUser, dataset)) {
            return true;
        }
        return false;
    }

    static isFunction(parsed) {
        logger.debug('Checking if it is a function', parsed);

        if (!parsed.select || parsed.select.length !== 1 || parsed.select[0].type !== 'function') {
            throw new ValidationError(400, 'Invalid query. Function not found or not supported');
        }
        const node = parsed.select[0];
        const endpointConfig = endpoints[node.value.toLowerCase()];
        if (!endpointConfig) {
            throw new ValidationError(400, 'Invalid query. Function not found or not supported');
        }
        if (endpointConfig.arguments.length < node.arguments.length) {
            throw new ValidationError(400, `Invalid query. Invalid num arguments. Max num arguments: ${endpointConfig.arguments.length}`);
        }
        const path = {};
        const qs = {};
        const body = {};
        for (let i = 0, { length } = endpointConfig.arguments; i < length; i++) {
            const arg = endpointConfig.arguments[i];
            const argFun = node.arguments[i];
            if (!argFun) {
                if (arg.required) {
                    throw new ValidationError(400, 'Invalid query. Required param');
                }
            } else if (arg.location === 'path') {
                if (!path[arg.name]) {
                    path[arg.name] = argFun.value;
                } else {
                    path[arg.name] += `,${argFun.value}`;
                }
            } else if (arg.location === 'query') {
                if (!qs[arg.name]) {
                    qs[arg.name] = argFun.value;
                } else {
                    qs[arg.name] += `,${argFun.value}`;
                }
            } else if (arg.location === 'body') {
                if (!body[arg.name]) {
                    body[arg.name] = argFun.value;
                } else {
                    body[arg.name] += `,${argFun.value}`;
                }
            }
        }
        const uri = `${process.env.CT_URL}/${process.env.API_VERSION}${generateTemplateString(endpointConfig.uri)(path)}`;
        return {
            uri,
            method: endpointConfig.method,
            qs,
            body,
            simple: false,
            resolveWithFullResponse: true,
            json: true
        };
    }

    static async isQuery(tableName, parsed, sql, ctx) {
        logger.debug('Is query');
        let datasetId = tableName;
        if (parsed.from) {
            datasetId = parsed.from.replace(/"/g, '').replace(/'/g, '');
        }
        if (!datasetId) {
            throw new ValidationError(400, 'Invalid query');
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
            if (err.statusCode === 404) {
                throw new ValidationError(404, 'Dataset not found');
            }
            throw new ValidationError(500, err.message);
        }

        if (parsed && parsed.delete) {
            if (!QueryService.checkRoles(dataset, ctx.request.body.loggedUser)) {
                throw new ValidationError(403, 'Not authorized to execute DELETE query');
            }
        }

        let body = null;
        let qs = null;
        if (sql) {
            parsed.from = dataset.tableName;
            if (dataset.provider === 'gee') {
                parsed.from = `'${dataset.tableName}'`;
            }
            const newSql = Json2sql.toSQL(parsed);

            if (ctx.method === 'GET') {
                qs = { ...ctx.query, sql: newSql };
            } else {
                qs = { ...ctx.query };
                delete qs.sql;
                body = { ...ctx.request.body, sql: newSql };
            }
        } else {
            const newTableName = dataset.tableName;
            if (ctx.method === 'GET') {
                qs = { ...ctx.query, tableName: newTableName };
            } else {
                qs = { ...ctx.query };
                body = { ...ctx.request.body, tableName: newTableName };
            }
        }
        logger.debug('ctx', ctx.path);
        const options = {
            uri: `${process.env.CT_URL}/${process.env.API_VERSION}${ctx.path !== '/jiminy' ? ctx.path : '/query'}/${dataset.id}`,
            simple: false,
            resolveWithFullResponse: true,
            json: true
        };
        if (ctx.method === 'GET') {
            delete qs.loggedUser;
            options.qs = qs;
            options.method = 'GET';
        } else {
            delete qs.loggedUser;
            delete body.loggedUser;
            options.qs = qs;
            options.body = body;
            options.method = 'POST';
        }
        return options;
    }


    static async getTargetQuery(ctx) {
        logger.debug('Obtaining target query');
        const sql = ctx.query.sql || ctx.request.body.sql;
        const tableName = ctx.query.tableName || ctx.request.body.tableName;
        let parsed = null;
        if (!sql && !tableName) {
            throw new ValidationError(400, 'Sql o FS required');
        }
        try {
            if (sql) {
                parsed = new Sql2json(sql).toJSON();
            }
        } catch (e) {
            throw new QueryParsingError(e.message);
        }
        if (!tableName && !parsed.from) {
            logger.debug('Check if it is a function');
            return QueryService.isFunction(parsed);
        }

        return QueryService.isQuery(tableName, parsed, sql, ctx);
    }

    static getFieldsOfSql(ctx) {
        logger.debug('Obtaining fields');
        const sql = ctx.query.sql || ctx.request.body.sql;
        if (sql) {
            const parsed = new Sql2json(sql).toJSON();
            return parsed.select;
        }
        return null;
    }

}

module.exports = QueryService;
