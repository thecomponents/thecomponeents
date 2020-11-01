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
      let keyCategory = typographyCategory;
      let keyScale;
      let keySize;
      let keyMultiplier;

      Object.keys(data[typographyCategory]).forEach((scale) => {
        keyScale = scale;
        keySize = data[typographyCategory][scale].size;
        keyMultiplier = data[typographyCategory][scale].lineSizeMultiplier;

        typography.push(`('${keyCategory}' '${keyScale}' ${keySize} $lhRatio-${keyMultiplier})`);
      });
    }
  });

  parsedTypography = JSON.stringify(typography)
    .replace(`["(`, `$typography: (\n(`) // replace start array bracket with scss variable and (
    .replace(`)"]`, `)\n);\n`) // replace end array bracket with );
    .replace(/'/g, "\"")
    .replace(/","/g, ",\n")
    .replace(/\("/g, `\t("`);

  return `${imports}\n${parsedTypography}\n${weights}`;
}

module.exports = ymlToScssTypographyParser;
