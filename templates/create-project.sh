#!/bin/bash

# Create an empty project for NodeJS

echo "Initialize new project in $PWD"

dirname=$(dirname ${BASH_SOURCE[0]})

source $dirname/readme/generate.sh
source $dirname/project/ansible.sh
source $dirname/project/git.sh
source $dirname/project/makefile.sh
source $dirname/project/nodejs.sh
source $dirname/service/lint.sh