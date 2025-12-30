module.exports = {
    apps: [
      {
        name: "muatparts-buyer-az",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          PORT: 3003,
        },
      },
    ],
  };
  