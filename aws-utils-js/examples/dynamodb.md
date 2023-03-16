```js
const { DynamoDBClient, PutItemCommand, /*...*/ } = require("@aws-sdk/client-dynamodb");
const AWSXRay = require("aws-xray-sdk");

const client = AWSXRay.captureAWSv3Client(new DynamoDBClient(params));

//...
```
