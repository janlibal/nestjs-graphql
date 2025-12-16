#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432 --timeout=60 --strict
yarn run migrate:deploy
yarn run seed:prod
yarn run start:prod > prod.log 2>&1 &
/opt/wait-for-it.sh localhost:3600 --timeout=60 --strict
/opt/wait-for-graphql.sh http://localhost:3600/api/v1/graphql
yarn run test:e2e:ci
