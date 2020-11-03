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

// eslint-disable-next-line no-console
console.log('start generating scss maps');

categories.forEach((category) => { // eslint-disable-line consistent-return
  let tokens = {};
  let parser;
  const srcFile = path.join(__dirname, `../src/tokens/${category}.yml`);
  const distFile = path.join(__dirname, `../src/maps/${category}.scss`);

  try {
    const fileContents = fs.readFileSync(srcFile, 'utf8');
    tokens = yaml.safeLoad(fileContents);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`— ${category} map could not be generated because of error${!debug ? '; run "build:scssMaps:debug" for details' : ':'}`);

    if (debug) {
      console.log(error); // eslint-disable-line no-console
      console.log(' '); // eslint-disable-line no-console
    }

    return false;
  }

  switch (config[category]) {
    case 'map':
      parser = () => ymlToScssMapParser(tokens);
      break;
    case 'typography':
      parser = () => ymlToScssTypographyParser(tokens);
      break;
    case '':
      // eslint-disable-next-line no-console
      console.log('parser has not been defined');
      parser = () => ''; // todo handle consol.logs for empty parser
      break;
    default:
      // eslint-disable-next-line no-console
      console.log('defined parser does not exist');
      parser = () => ''; // todo handle consol.logs for empty parser
  }

  fs.writeFileSync(distFile, parser(), 'utf-8');

  // eslint-disable-next-line no-console
  console.log(`| ${category} map has been created${debug ? `:\n  ${parser()}` : ''}`);
});

// eslint-disable-next-line no-console
console.log('finish generating maps');
