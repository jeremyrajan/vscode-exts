npm i -g typescript
npm i -g vsce

## publish stuff
for d in ./extensions/* ; do
  echo Publishing ${d##*/} ...
  vsce ${d##*/}
done