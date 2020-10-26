const fs = require('fs');
const path = require('path');
const getTokensFromFile = require('./utils/getTokensFromFile');
const generateClassFromToken = require('./utils/generateClassFromToken');

const colorTokensFile = path.join(__dirname, '../src/tokens/colors.scss');
const colorTokens = getTokensFromFile(colorTokensFile);
const tokenList = Object.keys(colorTokens);

function buildTextColorClasses() {
  const patterns = {
    "[": "",
    "]": "",
    "'": "",
    ",": "/r"
  }
  const classes = tokenList.map((token) => generateClassFromToken(token, 'text')).toString();

  classes.replace(/[|]|'|,/g, m => patterns[m]);

  return classes;
}

console.log(buildTextColorClasses());
console.log('text color classes has been generated');
