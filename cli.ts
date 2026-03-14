#!/usr/bin/env bun

import yargs from "yargs";
import userBuild from ".";

await yargs(process.argv.slice(2))
  .example(
    "$0 tests/example.user.ts --outdir=tests",
    "build tests/example.user.ts into tests/example.user.js"
  )
  .example(
    '$0 "src/**/*.user.ts" --outdir=dist',
    "build all .user.ts files matching glob"
  )
  .command(
    "$0 <files..>",
    "build .user.ts file(s) into .user.js (supports globs)",
    (yargs) =>
      yargs
        .positional("files", {
          type: "string",
          array: true,
          describe: "the .user.ts file(s) or glob pattern(s) to build",
        })
        .demandOption("files")
        .option("outdir", {
          type: "string",
          describe: "output directory",
        })
        .option("target", {
          type: "string",
          choices: ["browser", "bun", "node"] as const,
          describe: "target environment",
        })
        .option("minify", {
          type: "boolean",
          describe: "minify the output",
        })
        .option("sourcemap", {
          type: "string",
          choices: ["none", "linked", "external", "inline"] as const,
          describe: "sourcemap generation mode",
        })
        .option("format", {
          type: "string",
          choices: ["esm", "cjs", "iife"] as const,
          describe: "output module format",
        })
        .option("external", {
          type: "array",
          string: true,
          describe: "packages to exclude from bundle",
        })
        .boolean("formatMeta")
        .describe("formatMeta", "format script meta (WIP, ping me to speed up)")
        .boolean("keepComments")
        .describe("keepComments", "keep comments (WIP, ping me to speed up)"),
    async (argv) => {
      await userBuild(argv.files, {
        outdir: argv.outdir,
        target: argv.target,
        minify: argv.minify,
        sourcemap: argv.sourcemap,
        format: argv.format,
        external: argv.external,
        formatMeta: argv.formatMeta,
        keepComments: argv.keepComments,
      });
    }
  )
  .help()
  .version()
  .parseAsync();
