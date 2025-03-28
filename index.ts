import { $ } from "bun";
import DIE from "phpdie";

/**
 * A cli tool to build *.user.ts into bundled *.user.js in a human readable style
 * @author: snomiao <snomiao@gmail.com>
 */
export default async function userBuild(
  entrypoint: string,
  options: {
    bunArgs?: string;
    formatMeta?: boolean;
    keepComments?: boolean;
  } = {}
) {
  let banner =
    (await Bun.file(entrypoint).text()).match(
      "// ==UserScript==\n(//.*\n)+"
    )?.[0] || DIE(`no userscript meta found in ${entrypoint}`);

  // todo: format banner
  if (options.formatMeta) {
    throw new Error("formatMeta not implemented");
  }
  if (options.keepComments) {
    throw new Error("keepComments not implemented");
  }

  return await $`bun build ${entrypoint} --banner=${banner} ${{
    raw: options.bunArgs ?? "",
  }}`.catch(() => {
    // BUN will print error message
    process.exit(1);
  });
}
