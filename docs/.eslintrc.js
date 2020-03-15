module.exports = {
  parser: 'babel-eslint',
  extends: ['standard'],
  plugins: ['import', 'react'],
  rules: {
    'quotes': 'double',
    'no-unused-vars': [2, { varsIgnorePattern: 'h' }],
    'react/jsx-uses-vars': 2,
    'no-undef': 0,
    'handle-callback-err': 0
  }
}
