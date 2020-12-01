const { transformSync } = require("esbuild");

// Note: transform will not bundle!
module.exports = (code, outputPath) => {
  if (outputPath.endsWith(".js")) {
    return transformSync(code, { loader: "js" });
  }
  if (outputPath.endsWith(".jsx")) {
    return transformSync(code, { loader: "jsx" });
  }
  if (outputPath.endsWith(".ts")) {
    return transformSync(code, { loader: "ts" });
  }
  if (outputPath.endsWith(".tsx")) {
    return transformSync(code, { loader: "tsx" });
  }
};
