#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
yarn install --frozen-lockfile
yarn run migrate:deploy
yarn run seed
yarn run start:test
