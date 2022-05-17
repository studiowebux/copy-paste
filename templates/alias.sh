#!/bin/bash

chmod +x ./create-service.sh
chmod +x ./create-lambda.sh
chmod +x ./create-project.sh

! grep -q 'alias create-service' ~/.zshrc; [ $? -eq 0 ] && echo -e "\nalias create-service=$PWD/create-service.sh" >> ~/.zshrc || echo '[create-service] alias already configured'
! grep -q 'alias create-lambda' ~/.zshrc; [ $? -eq 0 ] && echo "alias create-lambda=$PWD/create-lambda.sh" >> ~/.zshrc || echo '[create-lambda] alias already configured'
! grep -q 'alias create-project' ~/.zshrc; [ $? -eq 0 ] && echo "alias create-project=$PWD/create-project.sh" >> ~/.zshrc || echo '[create-project] alias already configured'

echo "Ok !"
echo "run \`source ~/.zshrc\`"