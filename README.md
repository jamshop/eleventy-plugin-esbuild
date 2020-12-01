# Eleventy Plugin - ESbuild

Install:

```
npm install @jamshop/eleventy-plugin-esbuild
```

## Usage

In you main config `.eleventy.js`: 
```
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginESbuild, {
    targets: {
      main: "src/index.js"
    }
    write: true,
    outdir: "_site/js"
  });
  // and the rest of your config
};
```

This will transpile the JavaScript in`src/index.js` to `_site/js/main.js`. The options are mostly the same as the default esbuild