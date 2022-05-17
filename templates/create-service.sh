#!/bin/bash

AWS_REGION='ca-central-1'
AWS_PROFILE='default'

echo "Initialize service in $PWD"

dirname=$(dirname ${BASH_SOURCE[0]})

source $dirname/service/directory.sh
source $dirname/service/npm.sh
source $dirname/service/lint.sh
source $dirname/service/configuration.sh
source $dirname/service/git.sh
source $dirname/service/github.sh
source $dirname/service/ansible.sh
source $dirname/service/serverless.sh