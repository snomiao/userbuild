import { $ } from "bun";
import DIE from "phpdie";

/**
 * A cli tool to build *.user.ts into bundled *.user.js in a human readable style
 * @author: snomiao <snomiao@gmail.com>
 */
export default async function userBuild(
  entrypoint: string,
  options: {
    // NOTE: bunArgs is joined as a string and passed raw — paths with spaces will break.
    // TODO: refactor to accept string[] for proper shell-safe argument passing.
    bunArgs?: string;
    format?: string;
    meta?: boolean;
  } = {}
) {
  let banner =
    (await Bun.file(entrypoint).text()).match(
      "// ==UserScript==\n(//.*\n)+"
    )?.[0] || DIE(`no userscript meta found in ${entrypoint}`);

  const result = await $`bun build ${entrypoint} --banner=${banner} --format=${options.format ?? "iife"} ${{
    raw: options.bunArgs ?? "",
  }}`.catch(() => {
    // BUN will print error message
    process.exit(1);
  });

  if (options.meta) {
    const outdirMatch = (options.bunArgs ?? "").match(/--outdir=(\S+)/);
    const outdir = outdirMatch?.[1] ?? ".";
    const basename = entrypoint.replace(/.*\//, "").replace(/\.ts$/, ".js");
    const metafile = `${outdir}/${basename}`.replace(/\.user\.js$/, ".meta.js");
    await Bun.write(
      metafile,
      `${banner}\n// Metadata-only file for Tampermonkey/Violentmonkey update checks.\nvoid 0;\n`
    );
  }

  return result;
}
