#!/bin/bash

cat >serverless.yml <<EOL
service: webux-serviceName
frameworkVersion: "2"

plugins:
  - serverless-offline

custom:
  node_env:
    prod: production
    dev: development
    qa: development
    stage: development
  tenant: \${env:TENANT, file(./config.\${opt:stage}.json):TENANT, "webux"}
  region: \${env:REGION, file(./config.\${opt:stage}.json):REGION, "ca-central-1"}
  apiDomainName: \${env:API_DOMAIN_NAME, file(./config.\${opt:stage}.json):API_DOMAIN_NAME, "webuxlab.com"}
  domainName: "serviceName"
  hostedZoneId: \${env:API_DOMAIN_NAME, file(./config.\${opt:stage}.json):HOSTED_ZONE_ID, ""} # TODO: import value !
    # Fn::ImportValue: webux-global:\${sls:stage}:HostedZoneId
  frontendDomainName: "*"
  debug: true

provider:
  name: aws
  runtime: nodejs14.x
  stage: \${opt:stage, "dev"} # Default stage to be used. Default is "dev"
  region: \${self:custom.region, "ca-central-1"} # Default region to be used. Default is "ca-central-1"

  memorySize: 128
  timeout: 6
  logRetentionInDays: 14
  lambdaHashingVersion: 20201221
  versionFunctions: false
  architecture: x86_64

  environment:
    NODE_ENV: \${self:custom.node_env.\${sls:stage}, "development"}
    DOMAIN_NAME: \${self:custom.frontendDomainName}
    DEBUG: \${self:custom.debug}

  endpointType: regional
  apiGateway:
    metrics: true
    shouldStartNameWithService: true
    minimumCompressionSize: 1024

  stackTags:
    tenant: \${self:custom.tenant, "webux"}
    stage: \${sls:stage}
    service: \${self:service}

  iam:
    role:
      name: \${self:service}-\${opt:stage, 'dev'}
      managedPolicies:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        - arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess
        - arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy
      statements:
        - Effect: Allow
          Sid: DynamoDBPermissions
          Action:
            - dynamodb:PutItem
            - dynamodb:Query
          Resource:
            - !GetAtt ServiceNameTable.Arn
        - Effect: Allow
          Sid: CloudwatchPermissions
          Action:
            - cloudwatch:PutMetricData
          Resource: "*"

  # vpc:
  #   securityGroupIds:
  #     - securityGroupId1
  #     - securityGroupId2
  #   subnetIds:
  #     - subnetId1
  #     - subnetId2

  tracing:
    apiGateway: true # Can only be true if API Gateway is inside a stack.
    lambda: true # Optional, can be true (true equals 'Active'), 'Active' or 'PassThrough'

  logs:
    restApi:
      accessLogging: false
      # format: 'requestId: \$context.requestId'
      executionLogging: true
      level: INFO # INFO or ERROR.
      fullExecutionData: true
      role:
        Fn::ImportValue: webux-global:\${sls:stage}:ApiGatewayLogsRole
      roleManagedExternally: true

package:
  excludeDevDependencies: true
  individually: true
  patterns:
    - "!**/*"

functions:
  serviceName:
    handler: services/serviceName/src/handlers/index.handler
    name: \${self:custom.tenant}-serviceName-\${sls:stage}
    description: Placeholder
    environment:
      SERVICENAME_TABLE_NAME: !Ref ServiceNameTable
    events:
      - http:
          path: serviceName
          method: post
          cors:
            origin: "\${self:custom.frontendDomainName}"
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
              - app-id
          authorizer:
            name: CognitoAuth
            type: COGNITO_USER_POOLS
            arn:
                Fn::ImportValue: webux-cognito:\${sls:stage}:CognitoPoolArn
          request:
            parameters:
              headers:
                app-id: true
            schemas:
              application/json:
                name: PostServiceName
                description: "POST ServiceName"
                schema: \${file(services/serviceName/post_serviceName.json)}
      - http:
          path: serviceName
          method: get
          cors:
            origin: "\${self:custom.frontendDomainName}"
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
              - app-id
          authorizer:
            name: CognitoAuth
            type: COGNITO_USER_POOLS
            arn:
                Fn::ImportValue: webux-cognito:\${sls:stage}:CognitoPoolArn
          request:
            parameters:
              headers:
                app-id: true
    package:
      patterns:
        - services/serviceName/node_modules/**
        - services/serviceName/src/**
        - services/serviceName/package.json

resources:
  Resources:
    ServiceNameTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: \${self:custom.tenant}-serviceName-\${sls:stage}
        AttributeDefinitions:
          - AttributeName: "pk"
            AttributeType: "S"
          - AttributeName: "sk"
            AttributeType: "S"
        KeySchema:
          - AttributeName: "pk"
            KeyType: "HASH"
          - AttributeName: "sk"
            KeyType: "RANGE"
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1

    BasePathMapping:
      Type: AWS::ApiGateway::BasePathMapping
      DependsOn:
        - ApiGatewayRestApi
        - DNSRecord
        - DomainName
      Properties:
        BasePath: ""
        DomainName: \${self:custom.domainName}.\${self:custom.apiDomainName}
        RestApiId: !Ref ApiGatewayRestApi
        Stage: \${sls:stage}

    DNSRecord:
      Type: AWS::Route53::RecordSet
      Properties:
        HostedZoneId: \${self:custom.hostedZoneId}
        Name: \${self:custom.domainName}.\${self:custom.apiDomainName}
        Type: A
        AliasTarget:
          DNSName: !GetAtt DomainName.RegionalDomainName
          HostedZoneId: !GetAtt DomainName.RegionalHostedZoneId

    ApiCertificate:
      Type: AWS::CertificateManager::Certificate
      Properties:
        DomainName: \${self:custom.domainName}.\${self:custom.apiDomainName}
        ValidationMethod: DNS
        DomainValidationOptions:
          - DomainName: \${self:custom.domainName}.\${self:custom.apiDomainName}
            HostedZoneId: \${self:custom.hostedZoneId}

    DomainName:
      Type: AWS::ApiGateway::DomainName
      Properties:
        DomainName: \${self:custom.domainName}.\${self:custom.apiDomainName}
        EndpointConfiguration:
          Types:
            - REGIONAL
        RegionalCertificateArn: !Ref ApiCertificate

  Outputs:
    ServiceNameTableName:
      Value: !Ref ServiceNameTable
      Description: ServiceNameTable Table name
      Export:
        Name: !Sub "\${self:service}:\${sls:stage}:ServiceNameTableName"
    ServiceNameTableArn:
      Value: !GetAtt ServiceNameTable.Arn
      Description: ServiceNameTable Table Arn
      Export:
        Name: !Sub "\${self:service}:\${sls:stage}:ServiceNameTableArn"

    ApiCertificateArn:
      Value: !Ref ApiCertificate
      Description: ServiceName Certificate ARN
      Export:
        Name: !Sub "\${self:service}:\${sls:stage}:ApiCertificateArn"

    RestApiEndpoint:
      Value: !Sub "https://\${DomainName}/"
      Description: The ServiceName Rest Api Endpoint
      Export:
        Name: !Sub "\${self:service}:\${sls:stage}:RestApiServiceNameEndpoint"

EOL
