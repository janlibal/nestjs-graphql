#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
yarn run migrate:deploy
node dist/prisma/seeds/seed.js

yarn run start:prod > prod.log 2>&1 &
/opt/wait-for-it.sh localhost:80
/opt/wait-for-graphql.sh http://localhost:80/api/v1/graphql
yarn run test:e2e:ci



#/opt/wait-for-it.sh postgres:5432
#yarn run migrate:deploy
#yarn run seed:prod
#yarn run start:prod > prod.log 2>&1 &
#/opt/wait-for-it.sh localhost:80
#/opt/wait-for-graphql.sh http://localhost:80/api/v1/graphql
#yarn run test:e2e:ci
