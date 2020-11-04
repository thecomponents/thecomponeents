const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const ymlToScssMapParser = require('./utils/ymlToScssMapParser');
const ymlToScssTypographyParser = require('./utils/ymlToScssTypographyParser');

const DEBUG_FLAG = '--debug';

let debug = false;
const args = process.argv;
const rawConfig = fs.readFileSync(path.join(__dirname, './tokenParser.config.json'), 'utf8');
const config = JSON.parse(rawConfig);
const categories = Object.keys(config);

if (args.includes(DEBUG_FLAG)) {
  debug = true;
}

console.log('start generating scss maps'); // eslint-disable-line no-console

categories.forEach((category) => { // eslint-disable-line consistent-return
  let tokens = {};
  let parser;
  let hasError;
  let errorMsg;
  const srcFile = path.join(__dirname, `../src/tokens/${category}.yml`);
  const distFile = path.join(__dirname, `../src/maps/${category}.scss`);

  try {
    const fileContents = fs.readFileSync(srcFile, 'utf8');
    tokens = yaml.safeLoad(fileContents);
  } catch (error) {
    hasError = true;
    errorMsg = error;
  }

  switch (config[category]) {
    case 'map':
      parser = () => ymlToScssMapParser(tokens);
      break;
    case 'typography':
      parser = () => ymlToScssTypographyParser(tokens);
      break;
    case '':
      hasError = true;
      errorMsg = '  parser has not been defined';
      break;
    default:
      hasError = true;
      errorMsg = '  defined parser does not exist';
  }

  if (hasError) {
    // eslint-disable-next-line no-console
    console.log(`— ${category} map could not be generated because of error${!debug ? '; run "build:scssMaps:debug" for details' : ':'}`);

    if (debug) {
      console.log(errorMsg); // eslint-disable-line no-console
      console.log(' '); // eslint-disable-line no-console
    }
  } else {
    fs.writeFileSync(distFile, parser(), 'utf-8');

    console.log(`| ${category} map has been created${debug ? `:\n  ${parser()}` : ''}`); // eslint-disable-line no-console
  }
});

console.log('finish generating maps'); // eslint-disable-line no-console
