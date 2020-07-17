#!/usr/bin/env bash

RSCRIPT_PATH="/Users/adrianjselva/Covid-19 Data/TDOH Data/"
RSCRIPT_FILE="tdoh_datasets.R"

SITE_PATH="/Users/adrianjselva/Projects/aselva.org"

cd "$RSCRIPT_PATH"
Rscript $RSCRIPT_FILE

RESULT=$?

if [ $RESULT -ne 0 ]
then
  echo "R script failed to execute properly. Error: ${RESULT}"
  exit 1
fi

zip -r counties.zip counties
scp counties.zip adrianjselva_gmail_com@aselva.org:/tmp/counties.zip

cp "cmaps.json" "$SITE_PATH/assets/cmaps.json"
cp "smaps.json" "$SITE_PATH/assets/smaps.json"
cp "counties.json" "$SITE_PATH/assets/counties.json"
cp "state.json" "$SITE_PATH/assets/state.json"

cd "$SITE_PATH"

git add "assets/cmaps.json"
git add "assets/smaps.json"
git add "assets/counties.json"
git add "assets/state.json"

echo "Verify that the proper changes have been made."
read -p "Are you sure you want to push to live? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  CDATE=$(date +'%m/%d/%Y')
  git commit -m "Daily update: $CDATE"

  git push origin
  git push live

  ssh -tt adrianjselva_gmail_com@aselva.org < ./remote-build.sh
else
  git reset HEAD
  git checkout .
fi
