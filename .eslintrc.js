module.exports = {
  extends: ['@zthun/eslint-config'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-use-before-define': 'off',
    'quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'react/prop-types': 'off'
  }
};
