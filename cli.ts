#!/usr/bin/env bun

import yargs from "yargs";
import userBuild from ".";

await yargs(process.argv.slice(2))
  .example(
    "$0 tests/example.user.ts -- --outdir=tests",
    "build tests/example.user.ts into tests/example.user.js"
  )
  .command(
    "$0 <file>",
    "build the .user.ts file into .user.js",
    (yargs) =>
      yargs
        .positional("file", {
          type: "string",
          describe: "the .user.ts file to build",
        })
        .demandOption("file")
        .option("format", {
          type: "string",
          default: "iife",
          describe: "output format (iife recommended for userscripts)",
        })
        .boolean("meta")
        .describe("meta", "also write a .meta.js metadata-only stub for update checks"),
    async (argv) => {
      // NOTE: argv._ contains remaining args after '--'. They are joined as a string,
      // which means paths with spaces will break. TODO: pass as array when bun shell supports it.
      await userBuild(argv.file, {
        bunArgs: argv._.join(" "),
        format: argv.format,
        meta: argv.meta,
      });
      return;
    }
  )
  .help()
  .version()
  .parseAsync();
