const { transformSync } = require("esbuild");

// Note: transform will not bundle!
module.exports = (content) => {
  const result = transformSync(content, { loader: "js" });
  if (result.js) {
    return `<script>${result.js}</script>`;
  }
  return `<script>console.log(${JSON.stringify(result.errors)})</script>`;
};