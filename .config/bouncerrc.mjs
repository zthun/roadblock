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
          "/": "http://roadblock-web:5173",
          "/api": "http://roadblock-api:3000",
        },
      },
    },
  ],
};
