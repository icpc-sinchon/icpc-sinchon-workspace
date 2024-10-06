// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
