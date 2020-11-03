const ymlToScssMapParser = require("./ymlToScssMapParser");

function ymlToScssTypographyParser(data) {
  let typography = [];
  let parsedTypography;
  let imports = '';
  let weights = '';

  Object.keys(data).forEach((typographyCategory) => {
    if (typographyCategory === 'import') {
      data[typographyCategory].forEach((importSrc) => {
        const currentImport = `@import "${importSrc}";\n`;

        imports = imports += currentImport;
      });
    } else if (typographyCategory === 'weight') {
      const dataWithKey = {
        weight: {
          ...data[typographyCategory]
        }
      }
      weights = ymlToScssMapParser(dataWithKey);
    } else {
      let keyCategory = {[typographyCategory]: []};
      let keyScale;
      let keySize;
      let keyMultiplier;

      Object.keys(data[typographyCategory]).forEach((scale) => {
        keyScale = scale;
        keySize = data[typographyCategory][scale].size;
        keyMultiplier = data[typographyCategory][scale].lineSizeMultiplier;

        keyCategory[typographyCategory].push(`('${keyScale}' ${keySize} $lhRatio-${keyMultiplier})`)
      });

      typography.push(keyCategory);
    }
  });

  parsedTypography = JSON.stringify(typography)
    .slice(2,-2) // remove beginning [{ and end }]
    .replace(/:\[/g, ": (\n") // remove :[ and add new line
    .replace(/]/g, "\n);\n") // replace ] with ; and new line
    .replace(/},{/g, "\n") // change array keys separator with new line
    .replace(/","/g, ",\n") // break lines
    .replace(/"/g, "") // remove doublequotes
    .replace(/'/g, "\"") // replace single quotes with doublequotes
    .replace(/\("/g, `\t("`) // add tab indents
    .replace(/[a-z0-9]\w+:/g, (s) => `$${s}`); // add $ to key name

  return `${imports}\n${parsedTypography}\n${weights}`;
}

module.exports = ymlToScssTypographyParser;
