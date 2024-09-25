module.exports = {
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://admin.suapc.kr/api/:path*", // Proxy to Backend
      },
    ];
  }, */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};
