import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      "process.env.PUBLIC_API_BASE_URL": JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || "http://localhost:7842"
      ),
    },
  },
  server: {
    // Dedicated, uncommon port to avoid clashes with other local dev servers.
    port: Number(process.env.WEB_PORT) || 7843,
  },
  output: {
    distPath: { root: "dist" },
  },
});
