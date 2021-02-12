# Query Microservice

[![Build Status](https://travis-ci.org/resource-watch/query.svg?branch=dev)](https://travis-ci.org/resource-watch/query)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3e6b21174a2e8fe2192c/test_coverage)](https://codeclimate.com/github/resource-watch/query/test_coverage)

This repository is the query microservice for WRI API

1. [Dependencies](#dependencies)
2. [Getting Started](#getting-started)

## Dependencies

 glad-alerts, guira-loss, imazon-alerts, jiminy, prodes-loss, quicc-alerts, terrai-alerts, viirs-active-fires

Dependencies on other Microservices:
- [Dataset](https://github.com/resource-watch/dataset/)
- [Glad Alerts](https://github.com/gfw-api/glad-analysis-tiled)
- [GFW Guira Loss](https://github.com/gfw-api/gfw-guira-loss-api)
- [GFW Imazon Alerts](https://github.com/gfw-api/gfw-imazon-alerts-api)
- [GFW Prodes Loss](https://github.com/gfw-api/gfw-prodes-loss-api)
- [GFW Quicc Alerts](https://github.com/gfw-api/gfw-quicc-alerts-api)
- [GFW Terra-i Alerts](https://github.com/gfw-api/gfw-terrai-alerts-api)
- [GFW Viirs Active Fires](https://github.com/gfw-api/gfw-viirs-fires-api)

## Getting Started

**First, make sure that you have the [API gateway running
locally](https://github.com/control-tower/control-tower).**

Start by cloning the repository from github to your execution environment

```
git clone https://github.com/resource-watch/query.git && cd query
```

After that, follow one of the instructions below:

### Using native execution

1 - Set up your environment variables. See `dev.env.sample` for a list of variables you should set, which are described in detail in [this section](#environment-variables) of the documentation. Native execution will NOT load the `dev.env` file content, so you need to use another way to define those values

2 - Install node dependencies using yarn:
```
yarn
```

3 - Start the application server:
```
yarn start
```

The endpoints provided by this microservice should now be available through Control Tower's URL.

### Using Docker

1 - Create and complete your `dev.env` file with your configuration. You can find an example `dev.env.sample` file in the project root.

2 - Execute the following command to run Control tower:

```
./query.sh develop
```

The endpoints provided by this microservice should now be available through Control Tower's URL.


You can now access the microservice through the API gateway.

### Configuration

It is necessary to define these environment variables:

* CT_URL => Control Tower URL
* API_VERSION => Actual version of the API (v1)
* NODE_ENV => Environment (prod, staging, dev)


