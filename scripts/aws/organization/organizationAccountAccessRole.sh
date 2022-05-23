#!/bin/bash

# Studiowebux S.E.N.C @ 2022

# Source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html#orgs_manage_accounts_create-cross-account-role

MANAGEMENT_ACCOUNT_ID=$1
AWS_PROFILE=$2

cat >role.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${MANAGEMENT_ACCOUNT_ID}:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role --role-name OrganizationAccountAccessRole --assume-role-policy-document file://role.json --profile ${AWS_PROFILE}

rm -f role.json

aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess --role-name OrganizationAccountAccessRole --profile ${AWS_PROFILE}
