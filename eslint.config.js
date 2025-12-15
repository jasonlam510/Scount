// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  globalIgnores(["dist/*", "node_modules/**", "**/node_modules/@powersync/**"]),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ["babel.config.js", "metro.config.js"],
    languageOptions: {
      globals: require("globals").node,
    },
  },
]);
