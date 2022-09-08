#!/bin/bash

mgmt_profile="default"
mgmt_region="ca-central-1"

export AWS_PROFILE="${mgmt_profile}"
export AWS_REGION="${mgmt_region}"

regions=("ca-central-1" "us-east-1")
accounts=$(aws organizations list-accounts --query 'Accounts[].{Id: Id, Name: Name}')

skipAccount=$(aws sts get-caller-identity --query 'Account' | tr -d '"')

echo "${accounts}" | jq .

ROLE_SESSION_NAME="ops"

assume_role(){
    ASSUMED_ROLE=$(aws sts assume-role --role-arn arn:aws:iam::${1}:role/OrganizationAccountAccessRole --role-session-name $ROLE_SESSION_NAME)

    if [ $? -ne 0 ]; then
        echo "Failed to assume the role defined"
        exit 2;
    fi

    export AWS_ACCESS_KEY_ID=$(echo $ASSUMED_ROLE | jq -r '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo $ASSUMED_ROLE | jq -r '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo $ASSUMED_ROLE | jq -r '.Credentials.SessionToken')
    unset AWS_PROFILE
}

back_to_management(){
    export AWS_PROFILE="${mgmt_profile}"
    export AWS_REGION="${mgmt_region}"
    unset AWS_ACCESS_KEY_ID
    unset AWS_SECRET_ACCESS_KEY
    unset AWS_SESSION_TOKEN
}

for item in $(echo $accounts | jq -r '.[] | @base64'); do
    _jq() {
        echo ${item} | base64 --decode | jq -r ${1}
    }
    
    accountId=$(echo $(_jq '.') | jq -r .Id)
    name=$(echo $(_jq '.') | jq -r .Name)

    echo "Account Id '${accountId}' / Account Name '${name}'"

    if [ "${skipAccount}" != "${accountId}" ]; then
        assume_role ${accountId}

        for region in "${regions[@]}"; do
            echo $region
            ##
            ## REPLACE THIS SECTION WITH YOUR COMMANDS
            ##
            aws sts get-caller-identity
            aws route53 list-hosted-zones \
                --query 'HostedZones[].{Name: Name, ResourceRecordSetCount: ResourceRecordSetCount}' \
                --output json \
                --no-paginate
            ##
            ## END
            ##
        done
    else
        echo "Skipped..."
    fi

    back_to_management

done