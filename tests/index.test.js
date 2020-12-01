const test = require("ava");
const pluginEsbuild = require("../index");
const TemplateConfig = require("@11ty/eleventy/src/TemplateConfig");
const eleventyConfig = require("@11ty/eleventy/src/EleventyConfig");
const defaultConfig = require("@11ty/eleventy/src/defaultConfig.js");
const TemplateRender = require("@11ty/eleventy/src/TemplateRender");
const EleventyExtensionMap = require("@11ty/eleventy/src/EleventyExtensionMap");
const fs = require("fs");

function getNewTemplateRender(name, inputDir) {
  let tr = new TemplateRender(name, inputDir);
  tr.extensionMap = new EleventyExtensionMap();
  return tr;
}

test("pluginEsbuild global data", (t) => {
  eleventyConfig.addPlugin(pluginEsbuild, {
    entryPoints: { main: require.resolve("./stubs/javascript.js") },
  });
  let cfg = new TemplateConfig(defaultConfig, "./config.js").getConfig();
  if(cfg.globalData) {
    t.not(Object.keys(cfg.globalData).indexOf("esbuild"), -1);
    const { js } = cfg.globalData;
    t.snapshot(js);
  } else {
    t.pass("No addGlobalData method available in 11ty.");
  }
});

test("pluginEsbuild output js", (t) => {
  eleventyConfig.addPlugin(pluginEsbuild, {
    entryPoints: { "main-js": require.resolve("./stubs/javascript.js") },
    output: "./tests/stubs/_out"
  });
  
  let content = fs.readFileSync(
    "./tests/stubs/_out/main-js.js",
    "utf-8"
  );

  t.snapshot(content);
});

test("pluginEsbuild output preact", (t) => {
  eleventyConfig.addPlugin(pluginEsbuild, {
    entryPoints: { "main-preact": require.resolve("./stubs/preact.js") }, 
    output: "./tests/stubs/_out",
    esbuild: {
      loader: {".js": "jsx"},
      jsxFactory: "h"
    }
  });
  
  let content = fs.readFileSync(
    "./tests/stubs/_out/main-preact.js",
    "utf-8"
  );
  t.snapshot(content);
});

test("pluginEsbuild output react", (t) => {
  eleventyConfig.addPlugin(pluginEsbuild, {
    entryPoints: { "main-react": require.resolve("./stubs/react.jsx") }, 
    output: "./tests/stubs/_out",
  });
  
  let content = fs.readFileSync(
    "./tests/stubs/_out/main-react.js",
    "utf-8"
  );
  t.snapshot(content);
});

test("Handlebars javascript Shortcode", async (t) => {
  let tr = getNewTemplateRender("hbs");
  tr.engine.addPairedShortcodes({
    javascript: pluginEsbuild.esBuildShortcode,
  });

  let fn = await tr.getCompiledTemplate(
    `{{#javascript}}  
      console.log("hello world!");
    {{/javascript}}`
  );

  t.snapshot(await fn());
});
