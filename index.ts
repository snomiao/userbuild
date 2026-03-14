import { $, type BuildOutput } from "bun";
import { glob } from "glob";
import DIE from "phpdie";

type BuildOptions = Omit<
  Parameters<typeof Bun.build>[0],
  "entrypoints" | "banner"
>;

type UserBuildOptions = BuildOptions & {
  /** raw CLI args passthrough (escape hatch for new/unsupported Bun.build flags) */
  bunArgs?: string;
  formatMeta?: boolean;
  keepComments?: boolean;
  /** write a .meta.js metadata-only stub alongside the built .user.js */
  meta?: boolean;
};

/**
 * Build *.user.ts into bundled *.user.js in a human readable style.
 * Accepts a single file, array of files, or glob pattern.
 * @author: snomiao <snomiao@gmail.com>
 */
export default async function userBuild(
  entrypoints: string | string[],
  options: UserBuildOptions | string = {}
): Promise<BuildOutput[]> {
  // backward compat: accept raw bunArgs string
  if (typeof options === "string") {
    return userBuild(entrypoints, { bunArgs: options });
  }

  // resolve glob patterns
  const files = await resolveEntrypoints(
    Array.isArray(entrypoints) ? entrypoints : [entrypoints]
  );

  if (files.length === 0) {
    DIE(`no files matched: ${entrypoints}`);
  }

  // build each file in parallel (each has its own banner)
  const results = await Promise.all(
    files.map((file) => buildOne(file, options))
  );

  return results;
}

async function resolveEntrypoints(patterns: string[]): Promise<string[]> {
  const files = await Promise.all(
    patterns.map((p) => (p.includes("*") ? glob(p) : Promise.resolve([p])))
  );
  return files.flat();
}

async function buildOne(
  entrypoint: string,
  options: UserBuildOptions
): Promise<BuildOutput> {
  const { formatMeta, keepComments, bunArgs, meta, ...buildOptions } = options;

  const banner =
    (await Bun.file(entrypoint).text()).match(
      /(\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\n?)/
    )?.[1] || DIE(`no userscript meta found in ${entrypoint}`);

  // todo: format banner
  if (formatMeta) {
    throw new Error("formatMeta not implemented");
  }
  if (keepComments) {
    throw new Error("keepComments not implemented");
  }

  // fallback to CLI when raw bunArgs provided (escape hatch for new/unsupported flags)
  if (bunArgs) {
    await $`bun build ${entrypoint} --banner=${banner} ${{
      raw: bunArgs,
    }}`.catch(() => {
      process.exit(1);
    });
    if (meta) {
      const outdirMatch = bunArgs.match(/--outdir=(\S+)/);
      const outdir = outdirMatch?.[1] ?? ".";
      const basename = entrypoint.replace(/.*\//, "").replace(/\.ts$/, ".js");
      const metafile = `${outdir}/${basename}`.replace(/\.user\.js$/, ".meta.js");
      await Bun.write(
        metafile,
        `${banner}\n// Metadata-only file for Tampermonkey/Violentmonkey update checks.\nvoid 0;\n`
      );
    }
    // return a minimal BuildOutput shape for compat
    return { success: true, outputs: [], logs: [] } as unknown as BuildOutput;
  }

  const result = await Bun.build({
    entrypoints: [entrypoint],
    banner,
    ...buildOptions,
  });

  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  if (meta) {
    const outdir = buildOptions.outdir ?? ".";
    const basename = entrypoint.replace(/.*\//, "").replace(/\.ts$/, ".js");
    const metafile = `${outdir}/${basename}`.replace(/\.user\.js$/, ".meta.js");
    await Bun.write(
      metafile,
      `${banner}\n// Metadata-only file for Tampermonkey/Violentmonkey update checks.\nvoid 0;\n`
    );
  }

  return result;
}
