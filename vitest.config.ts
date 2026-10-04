import { projectMonorepo } from "@zthun/janitor-vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [projectMonorepo()] });
