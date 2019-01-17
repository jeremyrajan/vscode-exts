npm i -g typescript
npm i -g vsce

## publish stuff
for d in $(pwd)/extensions/* ; do
  cd $d
  echo "Installing necessary packages"
  npm i
  echo "Publishing the packages"
  vsce publish -p ${VSCODE_TOKEN}
done