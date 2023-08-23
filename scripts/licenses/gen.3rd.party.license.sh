export TEMP_FOLDER=/tmp
export LICENSE_JSON=$TEMP_FOLDER/bnapp.3rd.party.license.json

npx license-checker --json --production --direct --customPath licenseText -out $LICENSE_JSON

node ./scripts/licenses/gen.3rd.party.license.js $LICENSE_JSON $*