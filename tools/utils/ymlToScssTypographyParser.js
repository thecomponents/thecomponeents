const ymlToScssMapParser = require('./ymlToScssMapParser');
const ymlToScssListParser = require('./ymlToScssListParser');

function ymlToScssTypographyParser(data) {
  let typography = '';

  Object.keys(data).forEach((typographyCategory) => {
    if (typographyCategory === 'import') {
      let imports = '';

      data[typographyCategory].forEach((importSrc) => {
        const currentImport = `@import "${importSrc}";\n`;

        imports += `${currentImport}`;
      });

      typography = `${imports}\n${typography}`;
    } else if (typographyCategory === 'weight') {
      const dataWithKey = {
        [typographyCategory]: {
          ...data[typographyCategory],
        },
      };

      typography += `${ymlToScssMapParser(dataWithKey)}\n`;
    } else if (typographyCategory === 'font') {
      const dataWithKey = {
        [typographyCategory]: {},
      };

      Object.keys(data[typographyCategory]).forEach((family) => {
        let familyValue = '';

        data[typographyCategory][family].forEach((font, index) => {
          if (index > 0) {
            familyValue += `, ${font}`;
          } else {
            familyValue += font;
          }
        });

        dataWithKey[typographyCategory][family] = familyValue;
      });

      typography += `${ymlToScssMapParser(dataWithKey)}\n`;
    } else {
      const keyCategory = { [typographyCategory]: [] };
      let keyScale;
      let keySize;
      let keyMultiplier;

      Object.keys(data[typographyCategory]).forEach((scale) => {
        keyScale = scale;
        keySize = data[typographyCategory][scale].size;
        keyMultiplier = data[typographyCategory][scale].lineSizeMultiplier;

        keyCategory[typographyCategory].push(`('${keyScale}' ${keySize} $lhRatio-${keyMultiplier})`);
      });

      typography += `${ymlToScssListParser(keyCategory)}\n`;
    }
  });

  return typography;
}

module.exports = ymlToScssTypographyParser;
