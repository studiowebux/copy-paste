#!/bin/bash

cat >src/handlers/index.js <<EOL
// Studio Webux S.E.N.C @ $(date +"%Y")

const { response, logger, jsonBody } = require('@webuxlab/wse-aws-utils');
/**
 *
 * @param {Object} event
 * @param {Object} context
 */
exports.handler = async (event, context) => {
  try {
    logger(event, context);

    if (
      event.requestContext.httpMethod &&
      event.requestContext.httpMethod === 'POST'
    ) {
      const {  } = jsonBody(
        event.body,
      );

      return response(201, {
        data: {
          message: 'Configuration saved',
        },
      });
    }

    if (
      event.requestContext.httpMethod &&
      event.requestContext.httpMethod === 'GET'
    ) {


      return response(200, {
        data: {  },
      });
    }
    return response(501, { message: 'Not Implemented' });
  } catch (e) {
    console.error(e);
    return response(500, { message: e.message });
  }
};
EOL
