#!/bin/bash -x

# Studiowebux S.E.N.C @ 2022

RED='\033[0;31m'
NC='\033[0m' # No Color

if [ "$ARN_MFA_DEVICE" == "" ]; then
    echo "No Arn for MFA Device provided"
    exit 1
fi

read -p 'Pin: ' PIN

if [ "$PIN" == "" ]; then
    echo "No Pin provided"
    exit 2
fi

MFA_ACCESS=$(aws sts get-session-token \
    --serial-number $ARN_MFA_DEVICE \
    --token-code $PIN)

if [ $? -ne 0 ]; then
    echo "${RED}Failed to connect with MFA${NC}"
    exit 3;
fi

export AWS_ACCESS_KEY_ID=$(echo $MFA_ACCESS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $MFA_ACCESS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $MFA_ACCESS | jq -r '.Credentials.SessionToken')
unset AWS_PROFILE

INFO=$(aws sts get-caller-identity)

ACCOUNT_ID=$(echo $INFO | jq -r '.Account')
USER=$(echo $INFO | jq -r '.Arn' | cut -d/ -f2)
CWD=$(echo $PWD | rev | cut -d/ -f1 | rev)

export PS1="(${RED}$ACCOUNT_ID/$USER${NC}) \\w % "

complete -W "\`grep -oE '^[a-zA-Z0-9_.-]+:([^=]|$)' ?akefile | sed 's/[^a-zA-Z0-9_.-]*$//'\`" make
