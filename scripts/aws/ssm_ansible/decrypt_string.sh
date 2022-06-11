#!/bin/bash

set -e

export AWS_PROFILE=""
export AWS_REGION=""

aws ssm get-parameter \
    --name /path/to/your/ansible/vault/password \
    --with-decryption \
    --query 'Parameter.Value' | tr -d '"' > .pwd

echo -n "$1" | tr -d ' ' | ansible-vault decrypt --vault-password-file .pwd

rm -f .pwd