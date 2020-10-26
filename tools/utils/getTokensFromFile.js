const fs = require('fs');

const replacePatterns = {
  ":root": "",
  "--": "\"--",
  ";": "\",",
  ": ": "\":\"",
  "	": "",
  "\r": " ",
  "\n": " ",
  "\r\n": " ",
};

function getTokensFromFile(file) {
  const tokensFileContent = fs.readFileSync(file, 'utf8');
  const convertCssFile = tokensFileContent
    .replace(/(;\r})|:root|--|;|	|(\r\n|\r|\n)|: /g, m => replacePatterns[m])
    .replace(", }", " }");

  return JSON.parse(convertCssFile)
}

module.exports = getTokensFromFile;
