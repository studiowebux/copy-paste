#!/bin/bash

echo "Initialize a lambda service in $PWD"

dirname=$(dirname ${BASH_SOURCE[0]})

source $dirname/lambda/directory.sh
source $dirname/lambda/npm.sh
source $dirname/lambda/configuration.sh
source $dirname/lambda/code.sh
source $dirname/lambda/test.sh