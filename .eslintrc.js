module.exports = require('@zthun/eslint-config');

config.settings = config.settings || {};
config.settings.react = config.settings.react || {};
config.settings.react.version = 'detect';

config.rules = config.rules || {};
config.rules['no-use-before-define'] = 'off';
config.rules['react/prop-types'] = 'off';

module.exports = config;
