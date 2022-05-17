#!/bin/bash

git init

cat >.gitignore <<EOF
# OS
.DS_Store

# Code
.env*

# AWS SAM
.aws-sam
*.zip

# Tests
*.log
reports/
coverage

# package directories
node_modules
jspm_packages

EOF