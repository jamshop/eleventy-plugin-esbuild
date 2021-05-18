const { transformSync } = require('esbuild');

// Note: transform will not bundle!
module.exports = (content) => {
  const result = transformSync(content, { loader: 'js' });
  if (result.code) {
    return `<script>${result.code}</script>`;
  }
  return `<script>console.log(${JSON.stringify(result.warnings)})</script>`;
};
