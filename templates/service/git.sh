#!/bin/bash

cat >.gitignore <<EOL
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

# Serverless directories
.serverless
EOL