// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    './jsSrc/': '/',
  },
  plugins: [
    [
      '@snowpack/plugin-optimize',
    ],
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
    /* ... */
  },
  buildOptions: {
    clean: false,
    out: "./public/",
  },
};
