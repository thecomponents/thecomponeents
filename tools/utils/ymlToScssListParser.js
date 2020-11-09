function convertTokensToList(data) {
  return JSON.stringify(data)
    .slice(1, -1) // remove beginning { and end }
    .replace(/:\[/g, ': (\n') // replace :[ with :( add new line
    .replace(/]/g, '\n);\n') // replace ] with ); and new line
    .replace(/","/g, ',\n') // break lines
    .replace(/"/g, '') // remove start & end doublequotes
    .replace(/'/g, '"') // replace single quotes with doublequotes
    .replace(/\("/g, '\t("') // add tab indents
    .replace(/[a-z0-9]\w+:/g, (s) => `$${s}`); // add $ to key name
}

module.exports = convertTokensToList;
