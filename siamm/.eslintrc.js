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
