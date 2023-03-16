// Studio Webux @ 2021 - 2022

const { PutMetricData } = require('@yetanothertool/cloudwatch-metric');
const { response } = require('@yetanothertool/response');
const { createLambdaSegmentWithSqs } = require('@yetanothertool/tracing');
const ApiError = require('@yetanothertool/error-handler');
const AWSXRay = require('aws-xray-sdk');
const logger = require('../config/logger');

exports.handler = async (event, context) => {
  logger.log.silly('Lambda Process started');
  logger.log.verbose(`SQS Message(s) received: ${event.Records?.length}`);

  let lambdaSegment;

  try {
    // SQS Event
    if (event && event.Records) {
      if (event.Records.length === 1) {
        logger.log.silly('Will process...');
        lambdaSegment = createLambdaSegmentWithSqs(event.Records[0], {
          ...context,
        });
        AWSXRay.setSegment(lambdaSegment);

        const record = event.Records[0];
        logger.log.debug(`record ${JSON.stringify(record)}`);

        const item = JSON.parse(record.body);
        logger.log.debug(`item ${JSON.stringify(item)}`);

        if (!item.url) {
          throw new ApiError(
            'Invalid Url',
            'INVALID_URL',
            400,
            {
              url: item.url,
            },
            `'${item.url}' doesn't match something`,
          );
        }

        logger.log.silly('Will process the url...');
        // ........ success = true
        logger.log.verbose('The url has been processed');
        if (success) {
          logger.log.debug(title, domain, baseDomain);
          logger.log.silly('Will put metrics in CloudWatch Metrics (WIP) Check the cost ...');
          await Promise.all([
            PutMetricData(
              1,
              'URL_PROCESSED',
              'processed',
              [{ Name: 'URL_SQS', Value: 'SQS' }],
              'Count',
            ),
            PutMetricData(
              1,
              'URL_PROCESSED',
              'processed',
              [{ Name: 'BASE_DOMAIN', Value: baseDomain }],
              'Count',
            ),
          ]);

          logger.log.verbose(`Has returned 200`);
          return response(200, { title, domain, baseDomain, item });
        }
      } else if (event.Records.length > 1) {
        throw new ApiError(
          'This lambda is configured to process one message at a time',
          'FEATURE_NOT_IMPLEMENTED',
          400,
        );
      }
    }

    throw new ApiError(
      'Method not implemented',
      'METHOD_NOT_IMPLEMENTED',
      400,
    );
  } catch (e) {
    logger.log.error(e.message || e.stack);
    return response(e.code || 500, { message: e.message, cause: e.cause });
  } finally {
    logger.log.verbose(`handler completed`);
    if (lambdaSegment) lambdaSegment.close();
  }
};
