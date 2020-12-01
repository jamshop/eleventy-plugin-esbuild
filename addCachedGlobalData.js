
// This utility ensures that a function ensures that data is only calculated once per build
module.exports = (eleventyConfig, cb, key) => {
  // Compile once to prime cache (data varaiable is our cache) and add watch targets
  let data = cb();
  let buildCounter = 0;
  let lastCompile = 0;

  // After each build increment the build counter
  eleventyConfig.on("afterBuild", () => {
    buildCounter++;
  });

  // If this is a function 11ty will attempt to resolve the data
  // If it is async 11ty will add the key scss and resolve data when called
  eleventyConfig.addGlobalData(key, () => {
    // if the lastCompile can buildCounter don't match the cached data
    if (lastCompile !== buildCounter) {
      lastCompile = buildCounter;
      data = cb();
    }
    return data;
  });
};
