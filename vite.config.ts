import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const base = process.env.GITHUB_PAGES === "true"
  ? "/historic-city-law-atlas/"
  : "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
