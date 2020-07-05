# Query Microservice

[![Build Status](https://travis-ci.org/resource-watch/query.svg?branch=develop)](https://travis-ci.org/resource-watch/query)
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
- [Query](https://github.com/resource-watch/query/)
- [Terra-i Alerts]()
- [Viirs Active Fires](https://github.com/gfw-api/gfw-viirs-fires-api)

## Getting Started

### OS X

**First, make sure that you have the [API gateway running
locally](https://github.com/control-tower/control-tower).**

We're using Docker which, luckily for you, means that getting the
application running locally should be fairly painless. First, make sure
that you have [Docker Compose](https://docs.docker.com/compose/install/)
installed on your machine.

```
git clone https://github.com/resource-watch/query
cd query
./query.sh develop
```text

You can now access the microservice through the CT gateway.

```

### Configuration

It is necessary to define these environment variables:

* CT_URL => Control Tower URL
* API_VERSION => Actual version of the API (v1)
* NODE_ENV => Environment (prod, staging, dev)


