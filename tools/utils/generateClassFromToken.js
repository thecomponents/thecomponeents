function generateClassFromToken(token, prefix) {
  const colorName = token.replace("--", "");

  return `.${prefix}-${colorName} { color: var(${token}); }`;
}

module.exports = generateClassFromToken;
