import { resolve } from "node:path";
import { defineConfig } from "vite";
import firstline from "./firstline.config.js";

function pageInputs() {
  return Object.fromEntries(
    firstline.pages.map((page) => {
      const source = page.source || "index.html";
      const name = source.replace(/\.html$/i, "") || "index";
      return [name, resolve(__dirname, source)];
    })
  );
}

export default defineConfig({
  base: "./",
  plugins: [{
    name: "coming-soon-mode",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        if (!firstline.comingSoon || !context.filename.endsWith("index.html")) return html;
        // Exclude the unfinished homepage from served and built HTML.
        return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Orellano's Auto Repair | Coming Soon</title>
<meta http-equiv="refresh" content="0;url=./coming-soon.html" />
<script>window.location.replace("./coming-soon.html");</script>
</head><body><a href="./coming-soon.html">Coming soon</a></body></html>`;
      }
    }
  }],
  build: {
    rollupOptions: {
      input: pageInputs()
    }
  }
});
