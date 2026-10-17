import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import type { Root } from "postcss";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "shared-site-shell",
      transformIndexHtml: {
        order: "pre",
        handler(html, context) {
          const hq = context.filename.replaceAll("\\", "/").endsWith("/hq/index.html");
          const shell = readFileSync(new URL("./src/shell.html", import.meta.url), "utf8")
            .replace("%PERSONAL_PAGE%", readFileSync(new URL("./src/personal/page.html", import.meta.url), "utf8"))
            .replace("%PERSONAL_CURRENT%", hq ? "" : 'aria-current="page"')
            .replace("%HQ_CURRENT%", hq ? 'aria-current="page"' : "")
            .replace("%PERSONAL_HIDDEN%", hq ? "hidden inert" : "")
            .replace("%HQ_HIDDEN%", hq ? "" : "hidden inert");
          return html.replace("<!-- app-shell -->", shell);
        },
      },
    },
    {
      name: "app-first-paint",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          // Vite recreates entry script tags, discarding the source blocking attribute.
          return html.replace('<script type="module"', '<script blocking="render" type="module"');
        },
      },
    },
  ],
  css: {
    postcss: {
      plugins: [{
        postcssPlugin: "isolate-site-styles",
        Once(root: Root) {
          root.walkRules(rule => {
            const file = rule.source?.input.file?.replaceAll("\\", "/") || "";
            const site = file.endsWith("/src/personal/styles.css") ? "personal" : file.endsWith("/src/styles.css") ? "hq" : null;
            if (!site || (rule.parent?.type === "atrule" && "name" in rule.parent && /keyframes$/i.test(String(rule.parent.name)))) return;
            const scope = `html[data-site="${site}"]`;
            rule.selectors = rule.selectors.map(selector => {
              if (selector.startsWith(":root")) return selector.replace(":root", scope);
              if (/^html(?=[^a-zA-Z0-9_-]|$)/.test(selector)) return selector.replace(/^html/, scope);
              return `${scope} ${selector}`;
            });
          });
        },
      }],
    },
  },
  server: {
    host: "127.0.0.1",
  },
  build: {
    rollupOptions: {
      input: {
        personal: "index.html",
        hq: "hq/index.html",
      },
    },
  },
});
