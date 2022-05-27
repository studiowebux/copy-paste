decrypt:
	ansible-playbook -i localhost, ./decrypt.yml

encrypt_one_value:
	echo '12345' | ansible-vault encrypt_string 'My String to output' --name 'encrypted_string_key' --vault-password-file /bin/cat

populate_ssm:
	@echo "Look at \`decrypt.yml\` to get the values"
	@echo "Look here to populate SSM: https://docs.ansible.com/ansible/latest/collections/community/aws/aws_ssm_parameter_store_module.html"