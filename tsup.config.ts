import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"], // library exports
    format: ["esm"], // ESM for imports
    dts: true, // generate types
    clean: true,
  },
  {
    entry: ["src/cli.ts"], // CLI entry
    format: ["cjs"], // CommonJS for Node CLI
    sourcemap: true,
    shims: true,
    clean: false, // keep library build intact
  },
]);
