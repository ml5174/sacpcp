#!/bin/bash
export PATH=/usr/sbin:/usr/local/bin:/usr/bin:/bin
set -x
TIMESTAMP=$(date +%Y%m%d_%H%M)
echo "See logs at ~/client/deploy_logs/deploy_${TIMESTAMP}.stderr"
exec 1>~/client/deploy_logs/deploy_${TIMESTAMP}.stdout
exec 2>~/client/deploy_logs/deploy_${TIMESTAMP}.stderr

DEPLOY_DIR=~/client
REPO_NAME='client_repo'
RUN_DIR=~/client/client_site
REPO_URL='https://git-codecommit.us-east-1.amazonaws.com/v1/repos/CPC_Client'
#EMAIL_TO='salarmycpc_dev@list.att.com'
#EMAIL_FROM='salarmycpc_dev@list.att.com'
EMAIL_TO='df6162@intl.att.com'
EMAIL_FROM='df6162@intl.att.com'

# Delete current repo
cd ${DEPLOY_DIR}
[ -d ${REPO_NAME} ] && rm -rf ${REPO_NAME}
git clone ${REPO_URL} ${REPO_NAME}

# Load NVM
export NVM_DIR="/home/salarmy/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ${DEPLOY_DIR}/${REPO_NAME}
npm install -g ionic
ionic build
sudo ln -sf ${DEPLOY_DIR}/${REPO_NAME}/www/ /var/www/html
curl -Ss localhost >> /dev/null
ret=$?
if [[ ${ret} -eq 0 ]] ; then
  rm -rf ${RUN_DIR}/www
  mv ${DEPLOY_DIR}/${REPO_NAME}/www ${RUN_DIR}/
  sudo ln -sf ${RUN_DIR}/www/ /var/www/html
  echo -e "Subject: Successfully deployed latest version of Salarmy Client on $(date)\n\r\
  Body: Salarmy Client successfully deployed on $(date)." | \
  sendmail -f ${EMAIL_FROM} ${EMAIL_TO}
else
  sudo ln -sf ${RUN_DIR}/www/ /var/www/html
  echo -e "Subject: Failed to deploy latest version of Salarmy Client on $(date)\n\r\
  Body: Salarmy Client failed to deploy on $(date)." | \
  sendmail -f ${EMAIL_FROM} ${EMAIL_TO}
fi
