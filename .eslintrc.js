module.exports ={
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb-base'
  ],
  globals: {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    semi: [1, 'never'],
    'space-before-function-paren': [1, 'never'],
    'no-console': [0],
    'func-names': [0],
    'no-return-assign': [0],
    'no-unused-vars': [1],
    'no-underscore-dangle': [0]
  }
}
