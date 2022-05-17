#!/bin/sh -e

source load-vars.sh $1

# ------

if [ "$$1" = "" ]; then
    echo "[${RED}Error${NC}] Missing ${BOLD}SSH Key${NC}"
    ERR=1
fi

if [ $ERR -eq 1 ]; then 
    echo "\n${I}Missing at least one required ${U}environment variable.${NC}"
    exit 1; 
fi

git_config(){
	git config user.email "${GIT_AUTHOR_EMAIL}"
	git config user.name "${GIT_AUTHOR}"
	mkdir -p ~/.ssh/ && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 
	git remote set-url origin $(echo $SOURCE_REPO_URL | sed 's/https:\/\/github.com\//git@github.com:/g')
	echo "$1" > /tmp/key.pem && chmod 600 /tmp/key.pem
	eval $(ssh-agent) && ssh-add /tmp/key.pem
}

tag_cleanup(){
	git tag -d $GIT_TAG
    git push origin :refs/tags/$GIT_TAG
}

tag_creation(){
	git tag $GIT_TAG -fa -m "${GIT_MESSAGE}" -m "${BUILD_URL}"
	git push origin $MAIN_BRANCH --tags
}

CURRENT_URL=$SOURCE_REPO_URL # To restore the Origin URL

if  [ $SUCCESS -eq 1 ] &&
    [ "${GIT_BRANCH}" = "${MAIN_BRANCH}" ]
then
	echo "==> Tagging this release with $GIT_TAG"
	git_config "$1"
    tag_cleanup
	tag_creation
	rm /tmp/key.pem
else
    echo "The Pipeline has failed or the source branch isn't the default branch."
    exit 2
fi

echo "==> Restore Git Origin URL"
git remote set-url origin $CURRENT_URL
