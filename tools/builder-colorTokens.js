const fs = require('fs');
const path = require('path');
const getTokensFromYmlFile = require('./utils/getTokensFromYmlFile');

const colorTokensFile = path.join(__dirname, '../src/tokens/colors.yml');
const colorTokens = getTokensFromYmlFile(colorTokensFile);
colorTokens.toString();
JSON.parse(colorTokens);
// const colorSassTokens = colorTokens.replaceAll("/([#A-Za-z0-9])\w+/g", "\"$1\"")


console.log(colorTokens);
console.log('text color classes has been generated');
