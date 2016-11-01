#!/bin/bash

ENV=$1
VERSION=$2

ENV_FILE=${ENV}.env
DEPLOY_DIR=~/deploy
S3_REGION='us-east-1'
MANAGEMENT_BUCKET='salarmy-management'
DEPLOY_BUCKET="salarmy-${ENV}-client"

function dir_setup {
  [[ ! -d ${DEPLOY_DIR} ]] && mkdir -p ${DEPLOY_DIR}
}

function get_version {
  # Get VERSION variable
  cd ${DEPLOY_DIR}
  aws s3 cp s3://${MANAGEMENT_BUCKET}/env/${ENV_FILE} . --region ${S3_REGION}
  . ${ENV_FILE}
}

function deploy_site {
  cd ${DEPLOY_DIR}
  aws s3 cp s3://${MANAGEMENT_BUCKET}/client-packages/client-${VERSION}.tgz . --region ${S3_REGION}
  tar -xf client-${VERSION}.tgz 
  aws s3 sync www s3://${DEPLOY_BUCKET}
  rm -f client-${VERSION}.tgz
  rm -rf www
}

function main {
  dir_setup
  [[ -z ${VERSION} ]] && get_version
  deploy_site
}

main
