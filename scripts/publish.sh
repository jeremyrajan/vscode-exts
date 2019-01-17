npm i -g typescript
npm i -g vsce

## publish stuff
for d in $(pwd)/extensions/* ; do
  cd $d
  vsce publish - ${VSCODE_TOKEN}
done