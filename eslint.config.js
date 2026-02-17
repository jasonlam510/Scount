// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  globalIgnores(["dist/*", ".node_modules/", ".cursor"]),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // Prevent import analysis from parsing bundled third-party artifacts.
    settings: {
      "import/ignore": ["node_modules", ".cursor"],
    },
  },
  {
    files: ["babel.config.js", "metro.config.js"],
    languageOptions: {
      globals: require("globals").node,
    },
  },
]);
