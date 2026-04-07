import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPage = repoName.endsWith(".github.io");
const ghPagesBase = isUserOrOrgPage || !repoName ? "/" : `/${repoName}/`;

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? ghPagesBase : "/",
});
