import { extensionLibrary, project } from "@zthun/janitor-vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [project(), extensionLibrary()] });
