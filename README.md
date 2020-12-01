# Eleventy Plugin - ESbuild

Install:

```
npm install @jamshop/eleventy-plugin-esbuild
```

## Usage

In you main config `.eleventy.js`: 
```js
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginESbuild, {
    entryPoints: {
      main: "src/index.js"
    }
    output: "_site/js"
  });
  // and the rest of your config
};
```

This will transpile JavaScript in`src/index.js` to `_site/js/main.js`. 

Their are 2 main options, `entryPoints` which is required and should contain a set of key/value pairs. The key represents the output file name (without extensions) and the value is the path to the source file. 

The second option `output` is optional although required in most situations. This is the output directory for the transpiled JavaScript. The generated file path will be a combination of the key and the `output`.

The third option is `esbuild` which allows you to provide options directly to esbuild's [Build API](https://esbuild.github.io/api/#build-api). If using esbuild options directly you may wish to prevent the plugin from generating the `outfile` by not providing the `output` option above.

## Examples

React:

```js
  eleventyConfig.addPlugin(pluginEsbuild, {
    entryPoints: { "main-react": require.resolve("./stubs/react.jsx") }, 
    output: "_site/js",
  });
```

Esbuild will automatically recognise some file extensions such as JSX and apply the appropiate loaders.

Preact:

```js
eleventyConfig.addPlugin(pluginEsbuild, {
  entryPoints: { "main-preact": require.resolve("./stubs/preact.js") }, 
  output: "_site/js",
  esbuild: {
    loader: {".js": "jsx"},
    jsxFactory: "h"
  }
});
```
It's also possible to specify which `loader` to use and which `jsxFactory`.

## Bonus

It also comes with a shortcode:

```js
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPairedShortcode("javascript", pluginEsbuild.esBuildShortcode)
  // and the rest of your config
};
```

Get your esbuild on in templates with a shortcode:

```
{{#javascript}}  
  console.log("hello world!");
{{/javascript}}`
```

## Bonus Bonus

It also comes with a transform:

```js
const pluginESbuild = require("@jamshop/eleventy-plugin-esbuild");

module.exports = (eleventyConfig) => {
  eleventyConfig.addTransform("transform-name", pluginESbuild.esBuildTransform);
  // and the rest of your config
};
```
Will transform the following file types: "js", "jsx", "ts", "tsx".