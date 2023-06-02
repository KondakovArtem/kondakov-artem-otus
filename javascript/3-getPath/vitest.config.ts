/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config)

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["test/**/*.test.*s"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});