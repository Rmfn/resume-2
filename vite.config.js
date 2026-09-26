import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" so the build works under a GitHub Pages sub-path like /Resume/
export default defineConfig({
  base: "./",
  plugins: [react()],
});
