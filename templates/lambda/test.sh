#!/bin/bash

cat >__tests__/event-get.json <<EOL
{
  "body": {},
  "headers": {
    "app-id": "webuxlab"
  },
  "requestContext": {
    "httpMethod": "GET",
    "identity": {
      "sourceIp": "1.2.3.4"
    }
  }
}
EOL

cat >__tests__/event-post.json <<EOL
{
  "body": {},
  "headers": {
    "app-id": "webuxlab"
  },
  "requestContext": {
    "httpMethod": "POST",
    "identity": {
      "sourceIp": "1.2.3.4"
    }
  }
}
EOL

cat >__tests__/index.spec.js <<EOL
require('dotenv').config({ path: \`\${__dirname}/../../../.env.test\` });
const { setContextMissingStrategy } = require('aws-xray-sdk');
const { handler } = require('../src/handlers/index');

setContextMissingStrategy(() => {});

const eventPost = require('./event-post.json');
const eventGet = require('./event-get.json');

describe('Tests POST handler', () => {
  test('verifies successful response', async () => {
    const result = await handler(eventPost);

    expect(typeof result).toBe('object');
    expect(result.statusCode).toEqual(201);
    expect(typeof result.body).toBe('string');

    const response = JSON.parse(result.body);

    expect(typeof response).toBe('object');
  });
});

describe('Tests GET handler', () => {
  test('verifies successful response', async () => {
    const result = await handler(eventGet);

    expect(typeof result).toBe('object');
    expect(result.statusCode).toEqual(200);
    expect(typeof result.body).toBe('string');

    const response = JSON.parse(result.body);

    expect(typeof response).toBe('object');
  });
});
EOL

cat >jest.config.js <<EOL
// jest.config.js

module.exports = {
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'report.xml',
      },
    ],
  ],
};
EOL
