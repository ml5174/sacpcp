#!/bin/bash
#set -x 

read -p "!!!!! sacpcp and src/lib (savi-lib) will be reset!!! Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi


declare -i GITLOG_MAIN_DT_UTC
declare -i GITLOG_LIB_DT_UTC

pwd
git checkout master 
git pull upstream master 
git reset --hard upstream/master

GITLOG_MAIN=`git log --date=iso --pretty=format:'%cd|%h|%s' -n1`
GITLOG_MAIN_DT=`echo ${GITLOG_MAIN} | cut -f1 -d'|'`
GITLOG_MAIN_DT_UTC=`date -ju -f '%F %T %z' "${GITLOG_MAIN_DT}"  '+%y%m%d%H%M'`

cd src/lib 1>/dev/null 2>&1
pwd
git checkout master 
git pull upstream master 
git reset --hard upstream/master

GITLOG_LIB=`git log --date=iso --pretty=format:'%cd|%h|%s' -n1`
GITLOG_LIB_DT=`echo ${GITLOG_LIB} | cut -f1 -d'|'`
GITLOG_LIB_DT_UTC=`date -ju -f '%F %T %z' "${GITLOG_LIB_DT}"  '+%y%m%d%H%M'`
echo "GITLOG_MAIN_DT_UTC=${GITLOG_MAIN_DT_UTC}"
echo "GITLOG_LIB_DT_UTC=${GITLOG_LIB_DT_UTC}"
 
if [ ${GITLOG_MAIN_DT_UTC} -gt ${GITLOG_LIB_DT_UTC} ]; then
  GITLOG=${GITLOG_MAIN}
  VERSION_CODE=${GITLOG_MAIN_DT_UTC}
  COMMENTS=`echo ${GITLOG_MAIN} | cut -f2,3 -d'|'`
  echo "Main sacpcp source code is newer"
  echo "Build number shall be ${VERSION_CODE}" 
  echo "Comments shall be ${COMMENTS}" 
else
  GITLOG=${GITLOG_LIB}
  VERSION_CODE=${GITLOG_LIB_DT_UTC}
  COMMENTS=`echo ${GITLOG_LIB} | cut -f2,3 -d'|'`
  echo "Lib savi-lib source code is newer"
  echo "Build number shall be ${VERSION_CODE}" 
  echo "Comments shall be ${COMMENTS}" 
fi

cd ../..

cat > sed.VERSION_CODE << EOF
s?_build_number_?${VERSION_CODE}?g 
EOF

read -p "Do you want to update the _build_number_ placeholder with what it shall be? " -n 1 -r
echo   
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
sed -i.bak -f sed.VERSION_CODE src/app/app.component.ts 
 
