const nock = require('nock');
const chai = require('chai');
const { getTestServer } = require('./utils/test-server');
const { createMockGetDataset, mockValidateRequestWithApiKey } = require('./utils/helpers');

chai.should();

let requester;

nock.disableNetConnect();
nock.enableNetConnect(process.env.HOST_IP);

describe('GET fields', () => {

    before(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw Error(`Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`);
        }

        requester = await getTestServer();
    });

    it('Doing a fields request for a dataset that does not exist should return a 400', async () => {
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
            .post(`/api/v1/query`)
            .set('x-api-key', 'api-key-test')
            .send({
                sql: 'select 1 from data'
            });

        response.status.should.equal(404);
        response.body.should.have.property('errors').and.be.an('array');
        response.body.errors[0].should.have.property('detail').and.equal(`Dataset not found`);
    });

    it('Doing a fields request to a dataset should forward the request to the corresponding endpoint (happy case - dataset id in request)', async () => {
        const testDocumentDataset = async (provider) => {
            mockValidateRequestWithApiKey({});
            const timestamp = new Date().getTime();

            createMockGetDataset(timestamp, { connectorType: 'rest', provider });

            const reply = {
                adm1: { type: 'keyword' },
                avg_biomass_per_ha: { type: 'double' },
                aze: { type: 'keyword' },
                extent_2000: { type: 'double' },
                extent_2010: { type: 'double' },
                global_land_cover: { type: 'keyword' },
                idn_forest_moratorium: { type: 'keyword' },
                ifl: { type: 'keyword' },
                iso: { type: 'keyword' },
                kba: { type: 'keyword' },
                land_right: { type: 'keyword' },
                landmark: { type: 'keyword' },
                managed_forests: { type: 'keyword' },
                mining: { type: 'keyword' },
                oil_palm: { type: 'keyword' },
                plantations: { type: 'keyword' },
                primary_forest: { type: 'keyword' },
                resource_right: { type: 'keyword' },
                tcs: { type: 'keyword' },
                threshold: { type: 'integer' },
                tiger_cl: { type: 'keyword' },
                total_area: { type: 'double' },
                total_biomass: { type: 'double' },
                total_co2: { type: 'double' },
                total_gain: { type: 'double' },
                water_stress: { type: 'keyword' },
                wdpa: { type: 'keyword' },
                weighted_biomass_per_ha: { type: 'float' },
                wood_fiber: { type: 'keyword' },
                year_data: {
                    type: 'nested',
                    include_in_parent: true,
                    properties: {
                        area_loss: { type: 'float' },
                        biomass_loss: { type: 'float' },
                        carbon_emissions: { type: 'float' },
                        year: { type: 'long' }
                    }
                }
            };

            nock(process.env.GATEWAY_URL, {
                reqheaders: {
                    'x-api-key': 'api-key-test',
                }
            })
                .get(`/v1/fields/${provider}/${timestamp}`)
                .reply(200, reply);

            const response = await requester
                .get(`/api/v1/fields/${timestamp}`)
                .set('x-api-key', 'api-key-test');

            response.status.should.equal(200);
            response.body.should.deep.equal(reply);
        };

        return Promise.all(['json', 'tsv', 'csv', 'xml'].map((provider) => testDocumentDataset(provider)));
    });

    afterEach(async () => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
