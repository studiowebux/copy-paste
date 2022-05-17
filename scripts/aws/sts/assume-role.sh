#!/bin/bash -x

# Studiowebux S.E.N.C @ 2022

RED='\033[0;31m'
NC='\033[0m' # No Color

ROLE_ARN=$ROLE_TO_ASSUME
ROLE_SESSION_NAME="ops"

if [ "$ROLE_ARN" == "" ]; then
    echo "No ROLE_TO_ASSUME defined"
    exit 1;
fi

ASSUMED_ROLE=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name $ROLE_SESSION_NAME)

if [ $? -ne 0 ]; then
    echo "Failed to assume the role defined"
    exit 2;
fi

export AWS_ACCESS_KEY_ID=$(echo $ASSUMED_ROLE | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $ASSUMED_ROLE | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $ASSUMED_ROLE | jq -r '.Credentials.SessionToken')
unset AWS_PROFILE
unset ROLE_TO_ASSUME

CUSTOM_PROMPT=$(echo $ROLE_ARN | cut -d / -f2)
ACCOUNT_ID=$(echo $ROLE_ARN | cut -d: -f5)
CWD=$(echo $PWD | rev | cut -d/ -f1 | rev)
export PS1="(${RED}$ACCOUNT_ID:$CUSTOM_PROMPT${NC}) $CWD % "

# How to launch
# export AWS_PROFILE=username@account
# AWS_REGION=ca-central-1 ROLE_TO_ASSUME="arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME>" /bin/bash -rcfile ./assume-role.sh -i
# aws sts get-caller-identity
# ctrl+d to quit the subshell