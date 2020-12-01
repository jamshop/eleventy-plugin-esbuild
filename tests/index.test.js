const test = require("ava");
const pluginEsbuild = require("../index");
const TemplateConfig = require("@11ty/eleventy/src/TemplateConfig");
const eleventyConfig = require("@11ty/eleventy/src/EleventyConfig");
const defaultConfig = require("@11ty/eleventy/src/defaultConfig.js");
const TemplateRender = require("@11ty/eleventy/src/TemplateRender");
const EleventyExtensionMap = require("@11ty/eleventy/src/EleventyExtensionMap");

function getNewTemplateRender(name, inputDir) {
  let tr = new TemplateRender(name, inputDir);
  tr.extensionMap = new EleventyExtensionMap();
  return tr;
}

test("pluginEsbuild global data matches snapshot", (t) => {
  eleventyConfig.addPlugin(pluginEsbuild, {
    targets: { main: require.resolve("./stub.js") },
  });
  let cfg = new TemplateConfig(defaultConfig, "./config.js").getConfig();
  t.not(Object.keys(cfg.globalData).indexOf("js"), -1);
  const { js } = cfg.globalData;
  t.snapshot(js);
});

test("Handlebars javascript Shortcode", async (t) => {
  let tr = getNewTemplateRender("hbs");
  tr.engine.addPairedShortcodes({
    javascript: pluginEsbuild.javascriptShortcode,
  });

  let fn = await tr.getCompiledTemplate(
    `{{#javascript}}  
      console.log("hello world!");
    {{/javascript}}`
  );

  t.snapshot(await fn());
});
