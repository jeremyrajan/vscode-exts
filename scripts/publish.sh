npm i -g typescript
npm i -g vsce

## publish stuff
for d in $(pwd)/extensions/* ; do
  cd $d
  npm i
  vsce publish -p ${VSCODE_TOKEN}
done