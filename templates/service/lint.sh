#!/bin/bash

cat >.eslintrc.js <<EOL
module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  plugins: ['jest', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  settings: {
    jest: {
      version: 26,
    },
  },
};
EOL

cat >.prettierrc <<EOL
{
  "semi": true,
  "singleQuote": true,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 80
}
EOL
