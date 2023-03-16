const AWSXRay = require("aws-xray-sdk");

// Source: https://github.com/kyhau/aws-tools/blob/main/X-Ray/xray-sqs-to-lambda/handler.ts
function createLambdaSegmentWithSqs(
  sqsRecord,
  { functionName, functionArn, awsRequestId },
  lambdaExecStartTime = new Date().getTime() / 1000
) {
  const traceHeaderStr = sqsRecord.attributes.AWSTraceHeader;
  const traceData = AWSXRay.utils.processTraceData(traceHeaderStr);
  const sqsSegmentEndTime =
    Number(sqsRecord.attributes.ApproximateFirstReceiveTimestamp) / 1000;
  const lambdaSegment = new AWSXRay.Segment(
    functionName,
    traceData.root,
    traceData.parent
  );

  lambdaSegment.origin = "AWS::Lambda::Function";
  lambdaSegment.start_time =
    lambdaExecStartTime - (lambdaExecStartTime - sqsSegmentEndTime);
  lambdaSegment.addPluginData({
    function_arn: functionArn,
    region: sqsRecord.awsRegion,
    request_id: awsRequestId,
  });
  return lambdaSegment;
}

module.exports = {
  createLambdaSegmentWithSqs,
};
