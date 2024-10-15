// @ts-check
const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  reactStrictMode: true,
};

module.exports = withVanillaExtract(nextConfig);
