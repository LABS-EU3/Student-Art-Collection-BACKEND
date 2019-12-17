module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "jest": true
  },
  extends: [
    'airbnb-base',
    "prettier"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "prettier/prettier":0,
    "prefer-destructuring":0,
    "import/no-unresolved":0,
    "no-unused-vars":0,
   "func-names":0,
   "no-console": 0
  }
};
