module.exports = {
  domains: [
    {
      name: 'roadblock.local.zthunworks.com',
      paths: {
        '/': 'roadblock-services-web:8080',
        '/api': 'roadblock-services-api:3000/api',
        '/api/health': 'zthunworks-services-helpful:3000/api/health'
      }
    }
  ]
};
