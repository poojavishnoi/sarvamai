const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    outfile: "dist/chat-widget.js",
    format: "iife",
    globalName: "ChatWidget",
    loader: { ".js": "jsx" },
  })
  .catch(() => process.exit(1));
