#!/usr/bin/env bash
set -e
set -x

/opt/wait-for-it.sh postgres:5432 --timeout=60 --strict
yarn run migrate:deploy
yarn run seed:prod

yarn run start:prod > prod.log 2>&1 &
sleep 2

/opt/wait-for-it.sh localhost:80 --timeout=60 --strict
/opt/wait-for-graphql.sh http://localhost:80/api/v1/graphql

yarn run test:e2e:ci
