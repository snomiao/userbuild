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
        .demandOption("file"),
    async (argv) => {
      console.log(argv);
      await userBuild(argv.file, argv._.join(" "));
      return;
    }
  )
  .help()
  .version()
  .parseAsync();
