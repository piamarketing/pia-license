/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const removeImports = require("next-remove-imports")();
const nextConfig = {
  reactStrictMode: true,
  i18n,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    //yorum
  },
};

module.exports = (phase, { defaultConfig }) => {
  return removeImports({
    ...defaultConfig,
    ...nextConfig,
  });
};
