const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let tokens = {};
const colorTokensFile = path.join(__dirname, '../src/tokens/colors.yml');
const tokensScssFile = path.join(__dirname, '../src/tokens/colors-generated.scss');

try {
  let fileContents = fs.readFileSync(colorTokensFile, 'utf8');
  tokens = yaml.safeLoad(fileContents);
} catch (e) {
  console.log(e)
}

function convertYmlToScss() {
  const scssTokensString = JSON.stringify(tokens);
  const scssTokensStringSplice = scssTokensString.slice(1, -1);
  const scssTokensStringSpliceScssObject = scssTokensStringSplice
    .replace("{", "(") // replace { by (
    .replace("}", ");\n") // replace } by ); and new line
    .replace(/,/g, ",\n") // set each token in new line
    .replace(":(\"", ": (\n\"") // break line after variable's ( and space before it (and after :)
    .replace("\")", "\"\n)") // break line before closing )
    .replace(/":"/g, "\": \"") // add space after token name's :
    .replace(/"[a-z]\w+": [(]/g, (s) => `$${s.replace(/"/g, '')}`) // add $ in the beginning of variable name
    .replace(/"[a-z0-9]\w+": /g, (s) => `\t${s}`); // add tabs in indent

  return scssTokensStringSpliceScssObject;
}

console.log(convertYmlToScss());

fs.writeFileSync(tokensScssFile, convertYmlToScss(), 'utf-8');

console.log('text color classes has been generated');
