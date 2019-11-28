module.exports = {
  parser: 'babel-eslint',
  extends: ['standard'],
  plugins: ['import', 'react'],
  rules: {
    'no-unused-vars': [2, { varsIgnorePattern: 'h' }],
    'react/jsx-uses-vars': 2,
    'no-undef': 0,
  }
}
