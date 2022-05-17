#!/bin/bash

cat >Makefile <<EOL
deploy:
	ansible-playbook -i local, ansible/00_serverless.yml -e stage=\${STAGE} -e role_to_assume=\${ROLE_TO_ASSUME}

deploy_stage:
	npm run deploy:\${STAGE}

build: install-deps lint audit test prune
	
install-deps:
	npm install
	npm run install

prune:
	npm run prune

lint:
	npm run lint

audit:
	npm run audit

test:
	npm run test
EOL

cat >ansible.cfg <<EOL
[defaults]

display_skipped_hosts = false
EOL

cat >ansible/00_serverless.yml <<EOL
---
- name: Deploy Serverless
  hosts: all
  connection: local
  gather_facts: no

  roles:
    - role: assume_role
    - role: serverless
EOL

mkdir -p ansible/roles/assume_role/tasks
cat >ansible/roles/assume_role/tasks/main.yml <<EOL
---
- community.aws.sts_assume_role:
    role_arn: "{{ role_to_assume }}"
    role_session_name: "OpsToCrossAccount"
  register: assumed_role

- name: Test AWS account access
  shell: "aws sts get-caller-identity"
  environment:
    AWS_ACCESS_KEY_ID: "{{ assumed_role.sts_creds.access_key }}"
    AWS_SECRET_ACCESS_KEY: "{{ assumed_role.sts_creds.secret_key }}"
    AWS_SESSION_TOKEN: "{{ assumed_role.sts_creds.session_token }}"
    AWS_REGION: "{{ aws_region }}"
  register: info

- name: Print info
  debug:
    msg: "{{ info.stdout_lines }}"
EOL


mkdir -p ansible/roles/serverless/tasks
cat >ansible/roles/serverless/tasks/main.yml <<EOL
---
- name: Deploy Serverless
  shell: make deploy_stage
  environment:
    STAGE: "{{ stage }}"
    AWS_ACCESS_KEY_ID: "{{ assumed_role.sts_creds.access_key }}"
    AWS_SECRET_ACCESS_KEY: "{{ assumed_role.sts_creds.secret_key }}"
    AWS_SESSION_TOKEN: "{{ assumed_role.sts_creds.session_token }}"
    AWS_REGION: "{{ aws_region }}"
    AWS_PROFILE: "" # Force set to empty, it uses this value if defined
  args:
    chdir: "../"
EOL

cat >ansible/group_vars/all.yml <<EOL
---
aws_region: "ca-central-1"
EOL
