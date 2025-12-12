import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import mochaPlugin from "eslint-plugin-mocha";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  mochaPlugin.configs.recommended,
]);
