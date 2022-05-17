#!/bin/bash

cat >config.dev.json <<EOL
{
  "API_DOMAIN_NAME": "dev.webuxlab.com",
  "TENANT": "w",
  "REGION": "$AWS_REGION"
}
EOL

cat >config.test.json <<EOL
{
  "API_DOMAIN_NAME": "test.webuxlab.com",
  "TENANT": "w",
  "REGION": "$AWS_REGION"
}
EOL

cat >config.prod.json <<EOL
{
  "API_DOMAIN_NAME": "webuxlab.com",
  "TENANT": "w",
  "REGION": "$AWS_REGION"
}
EOL

cat >.env.test <<EOL
AWS_REGION="$AWS_REGION"
AWS_PROFILE="$AWS_PROFILE"
EOL
