#!/bin/bash

npm init --yes

npm i --save-dev \
    husky \
    lint-staged \
    @commitlint/cli \
    @commitlint/config-conventional \
    lerna \
    eslint \
    eslint-config-airbnb-base \
    eslint-config-prettier \
    eslint-plugin-import \
    eslint-plugin-jest \
    eslint-plugin-prettier \
    prettier
    
npx husky install
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
npx husky add .husky/pre-commit "npm run precommit"
npx husky add .husky/pre-push "npm run test"

echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

cat >lerna.json <<EOL
{
    "packages": ["services/**", "libs/**"],
    "version": "0.0.0"
}
EOL

cat package.json \
    | jq -r '. + {
        scripts: {
            "test": "lerna run test --parallel",
            "lint": "lerna run lint --parallel",
            "audit": "lerna exec -- npm audit --production",
            "install": "lerna exec -- npm install",
            "prune": "lerna exec -- npm prune --production",
            "clean": "lerna exec -- \"rm -rf node_modules && rm -f package-lock.json\"",
            "precommit": "lint-staged"
        },
        "lint-staged": {
            "**/*.js": "eslint"
        }
    }' | tee package.json

mkdir -p {services,libs}/
touch {services,libs}/.gitkeep 