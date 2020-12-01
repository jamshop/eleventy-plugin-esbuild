const { buildSync } = require("esbuild");
const  addCachedGlobalData = require("./addCachedGlobalData");
const esBuildTransform = require("./transform");
const esBuildShortcode = require("./shortcode");
const path = require("path");

const compileEsBuildTargets = (targets, esBuildOptions) => {
  // targets:
  // [{ main: "/path/to.js"}]

  const files = Object.entries(targets); // [["main","path/to.js"], ...]

  // Note: ES build doesn't provide a way to get bundle information so
  // we can't add the bundled files as watch targets
  const data = {};
  for (let index = 0; index < files.length; index++) {
    const key = files[index][0];
    const file = files[index][1];
    const res = buildSync({
      entryPoints: [file],
      minify: process.NODE_ENV === "development" ? false : true,
      bundle: true,
      write: false,
      ...esBuildOptions
    });
    data[key] = new TextDecoder("utf-8").decode(res.outputFiles[0].contents);
  }
  return data;
};

const esBuildPlugin = async (eleventyConfig, { targets = {}, esBuildOptions = {} } = {}) => {
  if (Object.entries(targets).length === 0) {
    // Support older versions of 11ty
    if(eleventyConfig.addGlobalData) {
      // return an empty object if no enteries
      eleventyConfig.addGlobalData("esbuild", {});
    }
    console.log(`No js targets found.`);
    console.log(
      `Plugin expects data to be in the shape: { targets: name: "path/to/file.js"}`
    );
    return;
  }
 
 
  if(eleventyConfig.addGlobalData) {
    await addCachedGlobalData(
      eleventyConfig,
      () => compileEsBuildTargets(targets, esBuildOptions),
      "esbuild"
    );
  } else {
    compileEsBuildTargets(targets, esBuildOptions);
  }

  // Ideally we'd add a watch for each assets consumed by the entry but as yet I don't think that can be done with esbuild
  Object.entries(targets).forEach(([_, watchPath]) => {
    const relativePath = path.relative(process.cwd(), watchPath);
    eleventyConfig.addWatchTarget(relativePath);
  });

};

esBuildPlugin.esBuildTransform = esBuildTransform;
esBuildPlugin.esBuildShortcode = esBuildShortcode;

module.exports = esBuildPlugin;
