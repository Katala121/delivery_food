#!/usr/bin/env bash

rm -rf dist && mkdir dist

\cp -r src/* ./dist/
\cp .env ./dist/.env
\cp package.json ./dist/package.json

cd dist && cd ..