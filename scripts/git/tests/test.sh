#!/bin/sh

export STAGE=test
export TENANT=utils
export AWS_REGION=ca-central-1
export SUCCESS=1
export BUILD_ID=1

if [ ! -f ./test_key ] && [ ! -f ./test_key.pub ]; then
    ssh-keygen -b 2048 -t rsa -f ./test_key -q -N ""
    read -p "Copy and Paste the ./test_key.pub within the Github Deploy key. \nConfigure the Deploy key with write access. [CONTINUE]"
fi

.././git-tagger.sh "$(cat ./test_key)"

export ORGANISATION="webuxlab"
export REPOSITORY="utils"
export GITHUB_TOKEN=$GITHUB_TOKEN
export ENVIRONMENT_URL="https://webuxlab.com"
export LOG_URL="https://webuxlab.com"
export PRODUCTION_ENVIRONMENT='false'

.././git-deployment.sh started

echo "Wait 60 seconds."
sleep 60

.././git-deployment.sh deployed


export PRODUCTION_ENVIRONMENT='true'
.././git-deployment.sh started

echo "Wait 10 seconds."
sleep 10

.././git-deployment.sh deployed