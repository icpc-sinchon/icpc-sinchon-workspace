// @ts-check
const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin({
  // identifiers: "short",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = withVanillaExtract(nextConfig);
