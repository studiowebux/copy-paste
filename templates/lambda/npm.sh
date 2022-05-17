#!/bin/bash

npm init --yes

npm install --save \
    @webuxlab/wse-aws-utils \
    aws-xray-sdk

npm install --save-dev \
    @types/jest \
    dotenv \
    jest \
    jest-junit

cat >.npmignore <<EOL
.eslintrc*
node_modules/
.gitignore
*.yaml
*.yml
*.sh
*.zip
*.toml
.env*
.aws-sam/
_test/
__tests__/
jest.config.js
EOL

cat package.json \
    | jq -r '. + {
        scripts: {
            "lint": "eslint *.js",
            "test": "jest --coverage"
        }
    }' | tee package.json