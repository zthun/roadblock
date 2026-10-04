export default {
  servers: [
    {
      type: "http",
      handle: "redirect",
    },
    {
      type: "https",
      security: {
        domain: "local.zthunworks.com",
      },
      domains: {
        "roadblock.local.zthunworks.com": {
          "/": "http://romulator-web:5173",
          "/api": "http://romulator-api:3000",
        },
      },
    },
  ],
};
