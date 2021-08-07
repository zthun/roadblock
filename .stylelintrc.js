const config = require('@zthun/stylelint-config');

config.rules = config.rules || {};
config.rules['no-descending-specificity'] = null;
config.rules['declaration-empty-line-before'] = 'never';

module.exports = config;
