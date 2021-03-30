const nock = require('nock');
const chai = require('chai');
const { getTestServer } = require('./utils/test-server');
const { createMockGetDataset } = require('./utils/helpers');

chai.should();

const requester = getTestServer();

nock.disableNetConnect();
nock.enableNetConnect(process.env.HOST_IP);

describe('GET query', () => {

    before(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw Error(`Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`);
        }

        nock.cleanAll();
    });

    it('Doing a basic query for a dataset that does not exist should return a 400', async () => {
        nock(process.env.CT_URL)
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
            .get(`/api/v1/query`)
            .query({
                sql: 'select 1 from data'
            });

        response.status.should.equal(404);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal(`Dataset not found`);
    });

    it('Calling the query endpoint with no sql parameter should return a 400 error message', async () => {
        const response = await requester.get(`/api/v1/query`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the query endpoint with an empty sql parameter should return a 400 error message', async () => {
        const response = await requester
            .get(`/api/v1/query?sql=`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the query endpoint with an invalid sql query should return a 400 error message', async () => {
        const response = await requester
            .get(`/api/v1/query?sql=foo`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Unsupported query element detected: foo');
    });

    it('Doing a query to a document dataset should forward the request to the corresponding endpoint (happy case - dataset id in request)', async () => {
        const testDocumentDataset = async (provider) => {
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
                        url: `/v1/query/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.CT_URL)
                .get(`/v1/query/${provider}/${timestamp}`)
                .query({
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);


            const response = await requester
                .get(`/api/v1/query/${timestamp}`)
                .query({
                    sql: `select 1 from data`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['json', 'tsv', 'csv', 'xml'].map((provider) => testDocumentDataset(provider)));
    });

    it('Doing a query to a rest dataset should forward the request to the corresponding endpoint (happy case - dataset id in request)', async () => {
        const testDocumentDataset = async (provider) => {
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
                        url: `/v1/query/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.CT_URL)
                .get(`/v1/query/${provider}/${timestamp}`)
                .query({
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);


            const response = await requester
                .get(`/api/v1/query/${timestamp}`)
                .query({
                    sql: `select 1 from data`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['featureservice', 'cartodb', 'wms', 'bigquery', 'gee', 'loca', 'nexgddp', 'rasdaman', 'vector'].map((provider) => testDocumentDataset(provider)));
    });


    it('Doing a query to a document dataset should forward the request to the corresponding endpoint (happy case - dataset id in query)', async () => {
        const testDocumentDataset = async (provider) => {
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
                        url: `/v1/query/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.CT_URL)
                .get(`/v1/query/${provider}/${timestamp}`)
                .query({
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);


            const response = await requester
                .get(`/api/v1/query`)
                .query({
                    sql: `select 1 from ${timestamp}`
                });

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['json', 'tsv', 'csv', 'xml'].map((provider) => testDocumentDataset(provider)));
    });

    it('Doing a query to a rest dataset should forward the request to the corresponding endpoint (happy case - dataset id in query)', async () => {
        const testDocumentDataset = async (provider) => {
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
                        url: `/v1/query/${timestamp}/clone`,
                        body: {
                            dataset: {
                                datasetUrl: `/v1/query/${timestamp}`,
                                application: ['your', 'apps']
                            }
                        }
                    }
                }
            };

            nock(process.env.CT_URL)
                .get(`/v1/query/${provider}/${timestamp}`)
                .query({
                    sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
                })
                .reply(200, reply);


            const response = await requester
                .get(`/api/v1/query`)
                .query({
                    sql: `select 1 from ${timestamp}`
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
