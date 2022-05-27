#!/bin/bash

# Simple bach script that calls the GoDaddy API to update the NS.
# Use with Cloudformation to automatically provision Route53 and update GoDaddy with the newly created NS 

# References: https://developer.godaddy.com

DOMAIN_NAME=""
API_KEY=""
API_SECRET=""

NS1=""
NS2=""
NS3=""
NS4=""

curl \
-X PUT \
-H "Authorization: sso-key ${API_KEY}:${API_SECRET}" \
-H "Content-Type: application/json" \
"https://api.godaddy.com/v1/domains/${DOMAIN_NAME}/records" \
-d '[{"type": "NS", "name": "@", "data": "'${NS1}'", "ttl": 3600},{"type": "NS", "name": "@", "data": "'${NS2}'", "ttl": 3600},{"type": "NS", "name": "@", "data": "'${NS3}'", "ttl": 3600},{"type": "NS", "name": "@", "data": "'${NS4}'", "ttl": 3600}]'  