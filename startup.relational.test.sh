#!/usr/bin/env bash
set -e

echo "🔄 Waiting for Postgres to be ready..."
/opt/wait-for-it.sh postgres:5432

echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

echo "🧱 Running DB migrations..."
yarn run migrate:deploy

echo "🌱 Seeding database..."
yarn run seed:prod

echo "🚀 Starting the app in test mode..."
yarn run start:test
