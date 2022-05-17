#!/bin/bash

chmod +x ./sts/assume-role.sh
chmod +x ./mfa/mfa.sh

! grep -q 'alias assume-role' ~/.zshrc; [ $? -eq 0 ] && echo -e "\nalias assume-role='/bin/bash -rcfile $PWD/assume-role.sh -i'" >> ~/.zshrc || echo '[assume-role] alias already configured'
! grep -q 'alias mfa-connect' ~/.zshrc; [ $? -eq 0 ] && echo -e "\nalias mfa-connect='/bin/bash -rcfile $PWD/mfa.sh -i'" >> ~/.zshrc || echo '[mfa-connect] alias already configured'

echo "Ok !"
echo "run \`source ~/.zshrc\`"