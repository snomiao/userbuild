import type { BuildConfig } from "bun";
import DIE from "phpdie";

/**
 * A cli tool to build *.user.ts into bundled *.user.js in a human readable style
 * @author: snomiao <snomiao@gmail.com>
 */
export default async function userBuild(
  entrypoint: string,
  options: Omit<BuildConfig, "entrypoints" | "banner"> = {}
) {
  const banner =
    (await Bun.file(entrypoint).text()).match(
      "// ==UserScript==\n(//.*\n)+"
    )?.[0] || DIE(`no userscript meta found in ${entrypoint}`);
  await Bun.build({
    entrypoints: [entrypoint],
    banner,
    ...options,
  });
}
