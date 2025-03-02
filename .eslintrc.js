module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    jest: true,
    browser: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'no-confusing-arrow': 'off',
    'linebreak-style': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-plusplus': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  parser: 'babel-eslint',
  plugins: ['react'],
  globals: {
    browser: true,
    $: true,
    before: true,
    document: true,
  },
};