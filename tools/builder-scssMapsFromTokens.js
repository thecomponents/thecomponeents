const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DEBUG_FLAG = '--debug';

let debug = false;
const args = process.argv;
const categories = args.slice(2);

if (args.includes(DEBUG_FLAG)) {
  debug = true;
  const debugIndex = categories.indexOf(DEBUG_FLAG);
  categories.splice(debugIndex, 1);
}

console.log('start generating scss maps');

categories.forEach((category) => {
  let tokens = {};
  const srcFile = path.join(__dirname, `../src/tokens/${category}.yml`);
  const distFile = path.join(__dirname, `../src/maps/${category}.scss`);

  try {
    let fileContents = fs.readFileSync(srcFile, 'utf8');
    tokens = yaml.safeLoad(fileContents);
  } catch (error) {
    console.log(`— ${category} map could not be generated because of error${!debug ? `; run 'build:scssMaps:debug' for details` : ''}`);
    if (debug) {
      console.log(error);
      console.log(' ');
    }
    return false;
  }

  function convertTokensToMap() {
    return JSON.stringify(tokens)
      .slice(1, -1) // remove { and } over tokens
      .replace("{", "(") // replace { by (
      .replace("}", ");\n") // replace } by ); and new line
      .replace(/,/g, ",\n") // set each token in new line
      .replace(":(\"", ": (\n\"") // break line after variable's ( and space before it (and after :)
      .replace("\")", "\"\n)") // break line before closing )
      .replace(/":"/g, "\": \"") // add space after token name's :
      .replace(/"[a-z]\w+": [(]/g, (s) => `$${s.replace(/"/g, '')}`) // add $ in the beginning of variable name
      .replace(/"[a-z0-9]\w*": /g, (s) => `\t${s}`); // add tabs in indent
  }

  console.log(`| ${category} map has been created${debug ? ':' : ''}`);
  if (debug) {
    console.log(`  ${convertTokensToMap()}`);
  }

  fs.writeFileSync(distFile, convertTokensToMap(), 'utf-8');
});

console.log('finish generating maps');
