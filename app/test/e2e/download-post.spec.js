const nock = require('nock');
const chai = require('chai');
const { getTestServer } = require('./utils/test-server');
const { createMockGetDataset, mockValidateRequestWithApiKey } = require('./utils/helpers');

chai.should();

let requester;

nock.disableNetConnect();
nock.enableNetConnect(process.env.HOST_IP);

describe('POST download', () => {

    before(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw Error(`Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`);
        }

        requester = await getTestServer();
    });

    it('Doing a basic download for a dataset that does not exist should return a 400', async () => {
        mockValidateRequestWithApiKey({});
        nock(process.env.GATEWAY_URL, {
            reqheaders: {
                'x-api-key': 'api-key-test',
            }
        })
            .get(`/v1/dataset/data`)
            .reply(404, {
                errors: [
                    {
                        status: 404,
                        detail: `Dataset with id 'data' doesn't exist`
                    }
                ]
            });

        const response = await requester
            .post(`/api/v1/download`)
            .set('x-api-key', 'api-key-test')
            .send({
                sql: 'select 1 from data'
            });

        response.status.should.equal(404);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal(`Dataset not found`);
    });

    it('Calling the download endpoint with no sql parameter should return a 400 error message', async () => {
        mockValidateRequestWithApiKey({});
        const response = await requester
            .post(`/api/v1/download`)
            .set('x-api-key', 'api-key-test');

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the download endpoint with an empty sql parameter should return a 400 error message', async () => {
        mockValidateRequestWithApiKey({});
        const response = await requester
            .post(`/api/v1/download?sql=`)
            .set('x-api-key', 'api-key-test');

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the download endpoint with an invalid sql download should return a 400 error message', async () => {
        mockValidateRequestWithApiKey({});
        const response = await requester
            .post(`/api/v1/download?sql=foo`)
            .set('x-api-key', 'api-key-test');

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Unsupported query element detected: foo');
    });

    it('Doing a download request to a document dataset should forward the request to the corresponding endpoint (happy case - dataset id in request)', async () => {
        const testDocumentDataset = async (provider) => {
            mockValidateRequestWithApiKey({});
            const timestamp = new Date().getTime();

            createMockGetDataset(timestamp, { connectorType: 'rest', provider });

            const reply = {
                data: [{
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3'
                }],
                meta: {
                    cloneUrl: {
                        http_method: 'POST',
                        url: `/v1/download/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.GATEWAY_URL, {
                reqheaders: {
                    'x-api-key': 'api-key-test',
                }
            })
                .post(`/v1/download/${provider}/${timestamp}`, {
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);

            const response = await requester
                .post(`/api/v1/download`)
                .set('x-api-key', 'api-key-test')
                .send({
                    sql: `select 1 from ${timestamp}`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['json', 'tsv', 'csv', 'xml'].map((provider) => testDocumentDataset(provider)));
    });

    it('Doing a download request to a rest dataset should forward the request to the corresponding endpoint (happy case - dataset id in request)', async () => {
        const testDocumentDataset = async (provider) => {
            mockValidateRequestWithApiKey({});
            const timestamp = new Date().getTime();

            createMockGetDataset(timestamp, { connectorType: 'document', provider });

            const reply = {
                data: [{
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3'
                }],
                meta: {
                    cloneUrl: {
                        http_method: 'POST',
                        url: `/v1/download/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.GATEWAY_URL, {
                reqheaders: {
                    'x-api-key': 'api-key-test',
                }
            })
                .post(`/v1/download/${provider}/${timestamp}`, {
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);

            const response = await requester
                .post(`/api/v1/download`)
                .set('x-api-key', 'api-key-test')
                .send({
                    sql: `select 1 from ${timestamp}`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['featureservice', 'cartodb', 'wms', 'bigquery', 'gee', 'loca', 'nexgddp', 'rasdaman', 'vector'].map((provider) => testDocumentDataset(provider)));
    });

    it('Doing a download request to a document dataset should forward the request to the corresponding endpoint (happy case - dataset id in query)', async () => {
        const testDocumentDataset = async (provider) => {
            mockValidateRequestWithApiKey({});
            const timestamp = new Date().getTime();

            createMockGetDataset(timestamp, { connectorType: 'rest', provider });

            const reply = {
                data: [{
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3'
                }],
                meta: {
                    cloneUrl: {
                        http_method: 'POST',
                        url: `/v1/download/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/download/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.GATEWAY_URL, {
                reqheaders: {
                    'x-api-key': 'api-key-test',
                }
            })
                .post(`/v1/download/${provider}/${timestamp}`, {
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);

            const response = await requester
                .post(`/api/v1/download/${timestamp}`)
                .set('x-api-key', 'api-key-test')
                .send({
                    sql: `select 1 from data`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['json', 'tsv', 'csv', 'xml'].map((provider) => testDocumentDataset(provider)));
    });

    it('Doing a download request to a rest dataset should forward the request to the corresponding endpoint (happy case - dataset id in query)', async () => {
        const testDocumentDataset = async (provider) => {
            mockValidateRequestWithApiKey({});
            const timestamp = new Date().getTime();

            createMockGetDataset(timestamp, { connectorType: 'document', provider });

            const reply = {
                data: [{
                    field1: 'value1',
                    field2: 'value2',
                    field3: 'value3'
                }],
                meta: {
                    cloneUrl: {
                        http_method: 'POST',
                        url: `/v1/download/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.GATEWAY_URL, {
                reqheaders: {
                    'x-api-key': 'api-key-test',
                }
            })
                .post(`/v1/download/${provider}/${timestamp}`, {
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);

            const response = await requester
                .post(`/api/v1/download/${timestamp}`)
                .set('x-api-key', 'api-key-test')
                .send({
                    sql: `select 1 from data`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['featureservice', 'cartodb', 'wms', 'bigquery', 'gee', 'loca', 'nexgddp', 'rasdaman', 'vector'].map((provider) => testDocumentDataset(provider)));
    });

    afterEach(async () => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
