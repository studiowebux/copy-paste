#!/bin/sh -e

set -o pipefail

source load-vars.sh $1

# ------

if [ "$ORGANISATION" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}ORGANISATION${NC}"
    ERR=1
fi
if [ "$REPOSITORY" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}REPOSITORY${NC}"
    ERR=1
fi
if [ "$GITHUB_TOKEN" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}GITHUB_TOKEN${NC}"
    ERR=1
fi
if [ "$GITHUB_TOKEN" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}GITHUB_TOKEN${NC}"
    ERR=1
fi

if [ $ERR -eq 1 ]; then 
    echo "\n${I}Missing at least one required ${U}environment variable.${NC}"
    exit 1; 
fi

create_deployment(){
	echo "Create Deployment"
	curl \
		-f -X POST \
		-u $GITHUB_TOKEN \
		-H "Accept: application/vnd.github.v3+json" \
		https://api.github.com/repos/${ORGANISATION}/${REPOSITORY}/deployments \
		-d '{"ref":"'${GIT_BRANCH}'","environment":"'${STAGE}'","required_contexts":[],"production_environment":'${PRODUCTION_ENVIRONMENT}'}' \
	| jq '.id' | tee /tmp/deployment_id
}

set_status() {
	echo "Set Status to '$1'"
	deployment_id=$(cat /tmp/deployment_id)

	echo "Deployment ID: $deployment_id"

	if [ "$1" = "started" ]; then
		state="in_progress"
	elif [ "$1" = "deployed" ]; then
		state="success"
	else
		state="failure"
	fi

	curl \
		-f -X POST \
		-u $GITHUB_TOKEN \
		-H "Accept: application/vnd.github.v3+json" \
		https://api.github.com/repos/${ORGANISATION}/${REPOSITORY}/deployments/${deployment_id}/statuses \
		-d '{"state":"'${state}'","environment":"'${STAGE}'","environment_url":"'${ENVIRONMENT_URL}'","log_url":"'${LOG_URL}'"}'
}

cleanup(){
	rm -f /tmp/deployment_id
}

delete(){
	deployment_id_to_delete=""
	curl \
		-f -X DELETE \
		-u $GITHUB_TOKEN \
		-H "Accept: application/vnd.github.v3+json" \
		https://api.github.com/repos/${ORGANISATION}/${REPOSITORY}/deployments/${deployment_id_to_delete}
}

if [ $1 = "started" ];
then
	cleanup
	create_deployment
	set_status $1
elif [ $1 = "deployed" ];
then
	set_status $1
	cleanup
else
	set_status
	cleanup
fi

