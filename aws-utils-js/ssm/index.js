const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const AWSXRay = require("aws-xray-sdk");

const client = AWSXRay.captureAWSv3Client(new SSMClient());

module.exports = async ({ Name, WithDecryption }) => {
  console.debug("GetSSM", Name);
  return client.send(new GetParameterCommand({ Name, WithDecryption }));
};
