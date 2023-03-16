const {
  CloudWatchClient,
  PutMetricDataCommand,
} = require("@aws-sdk/client-cloudwatch");
const AWSXRay = require("aws-xray-sdk");

const client = AWSXRay.captureAWSv3Client(
  new CloudWatchClient({ region: process.env.AWS_REGION })
);

/**
 *
 * @param {*} value
 * @param {*} metricName
 * @param {*} namespace
 * @param {*} dimensions [{Name: String,Value: String}]
 * @param {*} unit Default 'None'
 */
async function PutMetricData(
  value,
  metricName,
  namespace,
  dimensions = [],
  unit = "None"
) {
  try {
    const response = await client.send(
      new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: metricName,
            Dimensions: dimensions,
            Unit: unit,
            Value: value,
          },
        ],
        Namespace: `${process.env.SERVICE_NAME}-${namespace}-${process.env.STAGE}`,
      })
    );

    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = { PutMetricData };
