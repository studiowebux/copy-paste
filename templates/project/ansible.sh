#!/bin/bash

cat >ansible.cfg <<EOL
[defaults]

display_skipped_hosts = false
interpreter_python = /usr/local/bin/python3
stdout_callback = yaml

EOL

mkdir -p ansible/roles
touch ansible/roles/.gitkeep 

