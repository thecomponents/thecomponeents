const fs = require('fs');

function getTokensFromYmlFile(file) {
  return fs.readFileSync(file, 'utf8');
}

module.exports = getTokensFromYmlFile;
