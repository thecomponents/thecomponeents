const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let tokens = {};
const colorTokensFile = path.join(__dirname, '../src/tokens/colors.yml');

try {
  let fileContents = fs.readFileSync(colorTokensFile, 'utf8');
  tokens = yaml.safeLoad(fileContents);
} catch (e) {
  console.log(e)
}

function boczek() {
  const scssTokensString = JSON.stringify(tokens);
  const scssTokensStringSplice = scssTokensString.slice(1, -1);
  const scssTokensStringSpliceScssObject = scssTokensStringSplice
    .replace("{", "(")
    .replace("}", ")")
    .replace(/,/g, ",\n")
    .replace(":(\"", ": (\n\"")
    .replace("\")", "\"\n)")
    .replace(/":"/g, "\": \"")
    .replace(/"[a-z]\w+": [(]/g, (v) => `$${v.replace(/"/g, '')}`)
    .replace(/"[a-z0-9]\w+": /g, (v) => `\t${v}`);

  return scssTokensStringSpliceScssObject;
}

console.log(boczek())

console.log('text color classes has been generated');
