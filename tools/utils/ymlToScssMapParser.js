function convertTokensToMap(data) {
  return JSON.stringify(data)
    .slice(1, -1) // remove { and } over tokens
    .replace('{', '(') // replace { by (
    .replace('}', ');\n') // replace } by ); and new line
    .replace(/,/g, ',\n') // set each token in new line
    .replace(':("', ': (\n"') // break line after variable's ( and space before it (and after :)
    .replace(/"\)|[0-9)]/g, (s) => `${s.replace(')', '\n)')}`) // break line before closing )
    .replace(/":["|[0-9]/g, (s) => `${s.replace('":', '": ')}`) // add space after token name's :
    .replace(/"[a-z]\w+": [(]/g, (s) => `$${s.replace(/"/g, '')}`) // add $ in the beginning of variable name
    .replace(/"[a-z0-9]\w*": /g, (s) => `\t${s}`); // add tabs in indent
}

module.exports = convertTokensToMap;
