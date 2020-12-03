const { buildSync } = require("esbuild");
const addCachedGlobalData = require("./addCachedGlobalData");
const esBuildTransform = require("./transform");
const esBuildShortcode = require("./shortcode");
const path = require("path");

const compileEsBuildTargets = (entryPoints, output, esbuild = {}) => {
  // entryPoints:
  // [{ main: "/path/to.js"}]

  const files = Object.entries(entryPoints); // [["main","path/to.js"], ...]

  // Note: ES build doesn't provide a way to get bundle information so
  // we can't add the bundled files as watch targets
  const data = {};
  for (let index = 0; index < files.length; index++) {
    const key = files[index][0];
    const file = files[index][1];

    let outfile = undefined;
    if (output) {
      outfile = path.join(output, `${key}.js`);
    }

    const res = buildSync({
      entryPoints: [file],
      minify: process.NODE_ENV === "development" ? false : true,
      bundle: true,
      write: output ? true : false,
      outfile,
      ...esbuild,
    });
    if (res.outputFiles) {
      data[key] = new TextDecoder("utf-8").decode(res.outputFiles[0].contents);
    }
  }
  return data;
};

const esBuildPlugin = (
  eleventyConfig,
  { entryPoints = {}, output, esbuild } = {}
) => {
  if (Object.entries(entryPoints).length === 0) {
    // Support older versions of 11ty
    if (eleventyConfig.addGlobalData) {
      // return an empty object if no enteries
      eleventyConfig.addGlobalData("esbuild", {});
    }
    console.log(`No js entryPoints found.`);
    console.log(
      `Plugin expects data to be in the shape: { entryPoints: name: "path/to/file.js"}`
    );
    return;
  }

  const doBuild = () => {
    if (eleventyConfig.addGlobalData) {
      addCachedGlobalData(
        eleventyConfig,
        () => compileEsBuildTargets(entryPoints, output, esbuild),
        "esbuild"
      );
    } else {
      compileEsBuildTargets(entryPoints, output, esbuild);
    }
  }
  doBuild();
 
   // Ideally we'd add a watch for each assets consumed by the entry, but as yet I don't think that can be done with esbuild
  let watchPaths = [];
  Object.entries(entryPoints).forEach(([_, watchPath]) => {
    watchPaths.push(watchPath);
    eleventyConfig.addWatchTarget(watchPath);
  });
  eleventyConfig.on("beforeWatch", (changedFiles) => {
    // Run me before --watch or --serve re-runs
    if(watchPaths.some(watchPath => changedFiles.includes(watchPath))) {
      doBuild();
    }
  });


};

esBuildPlugin.esBuildTransform = esBuildTransform;
esBuildPlugin.esBuildShortcode = esBuildShortcode;

module.exports = esBuildPlugin;
