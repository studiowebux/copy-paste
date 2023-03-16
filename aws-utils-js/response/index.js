// Studio Webux S.E.N.C @ 2021

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.DOMAIN_NAME || '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key',
};

/**
 * Format the response to work with API Gateway
 * @param {Number} statusCode HTTP Code
 * @param {Object} body Body object
 * @param {Boolean} stringifyBody To use JSON.stringify
 * @param {Boolean} isBase64Encoded
 * @param {Object} customHeader to override the default header structure
 */
function response(
  statusCode,
  body,
  stringifyBody = true,
  isBase64Encoded = false,
  customHeader = null
) {
  const resp = {
    statusCode: statusCode || 500,
    body: stringifyBody
      ? body.body
        ? JSON.stringify(body)
        : JSON.stringify({ body })
      : body,
    headers: customHeader || DEFAULT_HEADERS,
    isBase64Encoded: isBase64Encoded,
  };

  return resp;
}

/**
 * Send the jsonify body of the request
 * @param {String|Object} body
 * @returns Object
 */
function jsonBody(body) {
  try {
    if (!body) {
      return {};
    }
    if (typeof body === 'string') {
      return JSON.parse(body);
    }

    return body;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  response,
  jsonBody,
};
