#!/bin/bash

set -e

export AWS_PROFILE=""
export AWS_REGION=""

certificate=$(aws acm list-certificates \
  --region us-east-1 \
  --certificate-statuses PENDING_VALIDATION \
  --query 'CertificateSummaryList[*] | [0]')

certificate_arn=$(echo ${certificate} | jq -r '.CertificateArn')
records=$(aws acm describe-certificate \
  --region us-east-1 \
  --certificate-arn ${certificate_arn} \
  --query 'Certificate.DomainValidationOptions[*].ResourceRecord')

domain_name=$(echo ${certificate} | jq -r '.DomainName')
hosted_zone_id=$(aws route53 list-hosted-zones-by-name \
    --dns-name ${domain_name} \
    --query "HostedZones[?Name==\`${domain_name}.\`].Id | [0]" | tr -d '"' | cut -d '/' -f 3)

echo "Hosted Zone Id ${hosted_zone_id}"
echo "Domain Name ${domain_name}"

rm -rf .dns
cat >.dns <<EOF
{
  "Comment": "ACM us-east-1",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": $(echo $records | jq '.[0].Name'),
        "Type": "CNAME",
        "TTL": 900,
        "ResourceRecords": [
          {
            "Value": $(echo $records | jq '.[0].Value')
          }
        ]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": $(echo $records | jq '.[1].Name'),
        "Type": "CNAME",
        "TTL": 900,
        "ResourceRecords": [
          {
            "Value": $(echo $records | jq '.[1].Value')
          }
        ]
      }
    }
  ]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id ${hosted_zone_id} \
  --change-batch=file://./.dns

rm -rf .dns
