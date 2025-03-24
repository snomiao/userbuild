import type { BuildConfig } from "bun";
import DIE from "phpdie";
import sflow from "sflow";

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
  const r = await Bun.build({
    entrypoints: [entrypoint],
    banner,
    ...options,
  });
  r.logs.forEach((log) => console.log(log));
  r.success || DIE("build failed");
  await sflow(r.outputs)
    .forEach(async (output) => {
      const path = await Bun.write(output.name, await output.text());
      console.log(`wrote ${path}`);
    })
    .run();
}
