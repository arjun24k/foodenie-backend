module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": "off",
    "arrow-parens":"off",
    "max-len": ["error", {"code": 130}],
    "indent":"off",
    "semi":"off",
    "comma-dangle":"off",
    "comma-spacing":"off",
    "camelcase":"off",
    "key-spacing":"off",
    "no-trailing-spaces":"off",
    "space-before-function-paren":"off",
    "no-multiple-empty-lines":"off",
    "prefer-const":"off",
    "spaced-comment":"off",
    "space-before-blocks":"off",
    "padded-blocks":"off"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
  },
};
