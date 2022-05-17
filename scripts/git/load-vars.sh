#!/bin/sh -e

RED='\033[1;31m'
YELLOW='\033[1;33m'
BOLD='\033[4;1m'
I='\033[3m'
U='\033[4m'
NC='\033[0m'

## Parameters
# $1 Private Github Deploy Key
# STAGE
# TENANT
# (Optional) AWS_REGION
# SUCCESS or CODEBUILD_BUILD_SUCCEEDING
# BUILD_ID or CODEBUILD_BUILD_ID

ERR=0

if [ "$1" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}SSH Key${NC}"
fi
if [ "$STAGE" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}STAGE${NC}"
    ERR=1
fi
if [ "$TENANT" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}TENANT${NC}"
    ERR=1
fi
if [ "$AWS_REGION" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}AWS_REGION${NC}"
fi
if [ "$SUCCESS" = "" ] && [ "$CODEBUILD_BUILD_SUCCEEDING" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}SUCCESS${NC} or ${BOLD}CODEBUILD_BUILD_SUCCEEDING${NC}"
    ERR=1
fi
if [ "$BUILD_ID" = "" ] && [ "$CODEBUILD_BUILD_ID" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}BUILD_ID${NC} or ${BOLD}CODEBUILD_BUILD_ID${NC}"
    ERR=1
fi
if [ "$ORGANISATION" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}ORGANISATION${NC}"
fi
if [ "$REPOSITORY" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}REPOSITORY${NC}"
fi
if [ "$GITHUB_TOKEN" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}GITHUB_TOKEN${NC}"
fi
if [ "$GITHUB_TOKEN" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}GITHUB_TOKEN${NC}"
fi
if [ "$ENVIRONMENT_URL" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}ENVIRONMENT_URL${NC}"
fi
if [ "$LOG_URL" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}LOG_URL${NC}"
fi

if [ $ERR -eq 1 ]; then 
    echo "\n${I}Missing at least one required${U}environment variable.${NC}"
    exit 1; 
fi


export GITHUB_TOKEN=$GITHUB_TOKEN
export ORGANISATION=$ORGANISATION
export REPOSITORY=$REPOSITORY
export ENVIRONMENT_URL=$ENVIRONMENT_URL
export LOG_URL=$LOG_URL
export PRODUCTION_ENVIRONMENT=$PRODUCTION_ENVIRONMENT
if [ "$PRODUCTION_ENVIRONMENT" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}PRODUCTION_ENVIRONMENT${NC}"
    PRODUCTION_ENVIRONMENT='false'
fi
export STAGE=$STAGE
export TENANT=$TENANT

export GIT_AUTHOR_EMAIL="$(git log -1 --pretty=%ae)"
export GIT_AUTHOR="$(git log -1 --pretty=%an)"
export GIT_COMMIT="$(git log -1 --pretty=%H)"
export GIT_SHORT_COMMIT="$(git rev-parse --short HEAD)"
export GIT_MESSAGE="$(git log -1 --pretty=%B)"
export SOURCE_REPO_URL="$(git remote get-url origin)"

export ACCOUNT_ID="$(aws sts get-caller-identity --query 'Account' --output text)"
if [ "$ACCOUNT_ID" = "" ]; then
    echo "[${YELLOW}Warning${NC}] Missing ${BOLD}ACCOUNT_ID${NC}"
    ACCOUNT_ID="Not Found"
fi
export AWS_REGION="$AWS_REGION"

export GIT_TAG="$TENANT-$STAGE"

export SUCCESS="$SUCCESS"
if [ "$SUCCESS" = "" ] ; then
    export SUCCESS=$CODEBUILD_BUILD_SUCCEEDING
fi

export GIT_BRANCH="$(git symbolic-ref HEAD --short 2>/dev/null)"
if [ "$GIT_BRANCH" = "" ] ; then
    GIT_BRANCH="$(git branch -a --contains HEAD | sed -n 2p | awk '{ printf $1 }')";
    export GIT_BRANCH=${GIT_BRANCH#remotes/origin/};
fi

export MAIN_BRANCH="$MAIN_BRANCH"
if [ "$MAIN_BRANCH" = "" ] ; then
    export MAIN_BRANCH="main"
fi

export BUILD_ID="$BUILD_ID"
if [ "$BUILD_ID" = "" ] ; then
    export BUILD_ID="$CODEBUILD_BUILD_ID"
fi

export BUILD_URL="$BUILD_URL"
if [ "$BUILD_URL" = "" ] ; then
    export BUILD_URL="https://$AWS_REGION.console.aws.amazon.com/codebuild/home?region=$AWS_REGION#/builds/$BUILD_ID/view/new"
fi

echo "\n---"
echo "${BOLD}GIT_AUTHOR_EMAIL${NC}: ${I}$GIT_AUTHOR_EMAIL${NC}"
echo "${BOLD}GIT_AUTHOR${NC}: ${I}$GIT_AUTHOR${NC}"
echo "${BOLD}GIT_COMMIT${NC}: ${I}$GIT_COMMIT${NC}"
echo "${BOLD}GIT_SHORT_COMMIT${NC}: ${I}$GIT_SHORT_COMMIT${NC}"
echo "${BOLD}GIT_MESSAGE${NC}: ${I}$GIT_MESSAGE${NC}"
echo "${BOLD}ACCOUNT_ID${NC}: ${I}$ACCOUNT_ID${NC}"
echo "${BOLD}AWS_REGION${NC}: ${I}$AWS_REGION${NC}"
echo "${BOLD}SUCCESS${NC}: ${I}$SUCCESS${NC}"
echo "${BOLD}GIT_TAG${NC}: ${I}$GIT_TAG${NC}"
echo "${BOLD}GIT_BRANCH${NC}: ${I}$GIT_BRANCH${NC}"
echo "${BOLD}MAIN_BRANCH${NC}: ${I}$MAIN_BRANCH${NC}"
echo "${BOLD}SOURCE_REPO_URL${NC}: ${I}$SOURCE_REPO_URL${NC}"
echo "${BOLD}BUILD_URL${NC}: ${I}$BUILD_URL${NC}"
echo "${BOLD}BUILD_ID${NC}: ${I}$BUILD_ID${NC}"
# Deployment Only 
echo "${BOLD}ORGANISATION${NC}: ${I}$ORGANISATION${NC}"
echo "${BOLD}REPOSITORY${NC}: ${I}$REPOSITORY${NC}"
echo "${BOLD}PRODUCTION_ENVIRONMENT${NC}: ${I}$PRODUCTION_ENVIRONMENT${NC}"
echo "${BOLD}ENVIRONMENT_URL${NC}: ${I}$ENVIRONMENT_URL${NC}"
echo "${BOLD}LOG_URL${NC}: ${I}$LOG_URL${NC}"