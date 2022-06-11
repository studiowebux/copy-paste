#!/bin/bash

set -e

export AWS_PROFILE=""
export AWS_REGION=""

VAULT_PASS=$(aws ssm get-parameter \
    --name /path/to/your/ansible/vault/password \
    --with-decryption \
    --query 'Parameter.Value' | tr -d '"')
 
echo $VAULT_PASS | ansible-vault encrypt_string \
    --vault-password-file /bin/cat \
    "$1" \
    --name 'encrypted_string'