import { extensionLibrary, projectNestJs } from "@zthun/janitor-vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [projectNestJs(), extensionLibrary()] });
