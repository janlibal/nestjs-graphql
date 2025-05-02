#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432 --timeout=60 --strict
yarn run migrate:deploy
yarn run seed:prod
yarn run start:prod
