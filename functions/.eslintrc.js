module.exports = {
  parser: '@babel/eslint-parser',
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    indent: 0,
    'max-len': 0,
    'quote-props': [2, 'as-needed'],
  },
};
