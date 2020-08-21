#!/usr/bin/env bash

RSCRIPT_PATH="/Users/adrianjselva/Covid-19 Data/TDOH Data/"
RSCRIPT_FILE="tdoh_datasets.R"

SITE_PATH="/Users/adrianjselva/Projects/aselva.org/"

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
rm counties.zip

cp "output/county_maps.json" "$SITE_PATH/assets/county_maps.json"
cp "output/state_maps.json" "$SITE_PATH/assets/state_maps.json"
cp "output/county_plots.json" "$SITE_PATH/assets/county_plots.json"
cp "output/state_plots.json" "$SITE_PATH/assets/state_plots.json"
cp "output/date.json" "$SITE_PATH/assets/date.json"

cd "$SITE_PATH"

git add "assets/county_maps.json"
git add "assets/state_maps.json"
git add "assets/county_plots.json"
git add "assets/state_plots.json"
git add "assets/date.json"

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
