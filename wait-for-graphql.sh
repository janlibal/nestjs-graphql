#!/bin/bash

url="$1"

echo "⏳ Waiting for GraphQL API at $url..."

until curl -s -o /dev/null -w '%{http_code}' "$url" | grep -q '[34][0-9][0-9]'; do
  echo "Waiting for GraphQL..."
  sleep 2
done

echo "✅ GraphQL is up and responding!"
