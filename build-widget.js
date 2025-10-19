const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: false,
    outfile: "dist/chat-widget.js",
    format: "iife",
    platform: "browser",
    loader: { ".js": "jsx" },
  })
  .catch(() => process.exit(1));
