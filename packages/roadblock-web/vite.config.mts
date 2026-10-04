import { extensionDevServer, projectReact } from "@zthun/janitor-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [projectReact(), extensionDevServer()],
});
