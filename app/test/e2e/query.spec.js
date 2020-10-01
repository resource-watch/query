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
            .post(`/api/v1/query`)
            .send({
                sql: 'select 1 from data'
            });

        response.status.should.equal(404);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal(`Dataset not found`);
    });

    it('Doing a basic query should forward the request to the corresponding endpoint (happy case)', async () => {
        const timestamp = new Date().getTime();

        createMockGetDataset(timestamp);

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
            .post(`/v1/query/${timestamp}`, {
                sql: 'SELECT 1 FROM index_d1ced4227cd5480a8904d3410d75bf42_1587619728489'
            })
            .reply(200, reply);


        const response = await requester
            .post(`/api/v1/query`)
            .send({
                sql: `select 1 from ${timestamp}`
            });

        response.status.should.equal(200);
        response.body.should.deep.equal(reply);
    });

    it('Calling the query endpoint with no sql parameter should return a 400 error message', async () => {
        const response = await requester.post(`/api/v1/query`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the query endpoint with an empty sql parameter should return a 400 error message', async () => {
        const response = await requester
            .post(`/api/v1/query?sql=`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Sql o FS required');
    });

    it('Calling the query endpoint with an invalid sql query should return a 400 error message', async () => {
        const response = await requester
            .post(`/api/v1/query?sql=foo`);

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal('Unsupported query element detected: foo');
    });

    it('Calling the query endpoint with a valid sql query should return a 200', async () => {
        nock(process.env.CT_URL)
            .get('/v1/dataset/dataset')
            .reply(200, {
                data: {
                    id: '06c44f9a-aae7-401e-874c-de13b7764959',
                    type: 'dataset',
                    attributes: {
                        name: 'Historical Precipitation -- U.S. (Puget Sound Lowlands)',
                        slug: 'Historical-Precipitation-US-Puget-Sound-Lowlands-1490086842133',
                        type: 'tabular',
                        subtitle: null,
                        application: [
                            'prep'
                        ],
                        dataPath: null,
                        attributesPath: null,
                        connectorType: 'document',
                        provider: 'csv',
                        userId: '586bc76036aacd381cb92b3a',
                        connectorUrl: 'https://raw.githubusercontent.com/fgassert/PREP-washington-observed-data/master/observed_precip.csv',
                        sources: [],
                        tableName: 'index_06c44f9aaae7401e874cde13b7764959',
                        status: 'saved',
                        published: false,
                        overwrite: false,
                        mainDateField: null,
                        env: 'production',
                        geoInfo: false,
                        protected: false,
                        legend: {
                            date: [],
                            region: [],
                            country: [],
                            nested: [],
                            integer: [],
                            short: [],
                            byte: [],
                            double: [],
                            float: [],
                            half_float: [],
                            scaled_float: [],
                            boolean: [],
                            binary: [],
                            text: [],
                            keyword: []
                        },
                        clonedHost: {},
                        errorMessage: null,
                        taskId: null,
                        createdAt: '2016-08-01T15:28:15.050Z',
                        updatedAt: '2018-01-05T18:15:23.266Z',
                        dataLastUpdated: null,
                        widgetRelevantProps: [],
                        layerRelevantProps: []
                    }
                }
            });


        nock(process.env.CT_URL)
            .post('/v1/query/06c44f9a-aae7-401e-874c-de13b7764959', {
                sql: 'SELECT * FROM index_06c44f9aaae7401e874cde13b7764959'
            })
            .reply(200, { data: 'aaa' });

        const response = await requester
            .post(`/api/v1/query?sql=select * from dataset`);

        response.status.should.equal(200);
        response.body.should.deep.equal({ data: 'aaa' });
    });

    afterEach(async () => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
