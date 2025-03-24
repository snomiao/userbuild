#!/usr/bin/env bun

import yargs from "yargs";
import userBuild from ".";
await yargs(process.argv.slice(2))
  .command(
    "$0 <file>",
    "build the .user.ts file into .user.js",
    (yargs) =>
      yargs
        .positional("file", { type: "string" })
        .required("file")
        .alias("file", "f"),
    async (argv) => {
      return userBuild(argv.file);
    }
  )
  .help()
  .version()
  .parseAsync();
