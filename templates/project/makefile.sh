#!/bin/bash

cat  <<'EOF' > Makefile
.PHONY: help

help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Installation

prune: ## Clean the whole project
	@echo "TODO: prune"	

install: ## Install NodeJS Dependencies
	@echo "TODO: install"

##@ Test and Validation

test: ## Test the project
	@echo "TODO: test"

e2e: ## Launch E2E tests
	@echo "TODO: e2e"

audit: ## Audit the project
	@echo "TODO: audit"

lint: ## Lint the different components
	@echo "TODO: lint"

##@ Deployment

deploy: ## Deploy the project
	@echo "TODO: deploy"

EOF