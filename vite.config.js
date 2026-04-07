import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths are the most resilient choice for GitHub Pages.
  base: "./",
});
