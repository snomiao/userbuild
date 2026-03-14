import userBuild from ".";
it("works", async () => {
  await userBuild("tests/example.user.ts", { outdir: "tests" });
  const code = await Bun.file("tests/example.user.js").text();

  expect(code).not.toContain("import md5 from 'md5';");

  expect(code).toContain("==/UserScript==");
  expect(code).not.toContain("SHOULD_NOT_INCLUDE_COMMENT_IN_CODE");
});

it("generates .meta.js with --meta flag", async () => {
  await userBuild("tests/example.user.ts", {
    outdir: "tests",
    meta: true,
  });

  const meta = await Bun.file("tests/example.meta.js").text();

  expect(meta).toContain("==UserScript==");
  expect(meta).toContain("==/UserScript==");
  expect(meta).toContain("void 0;");
  expect(meta).toContain("Metadata-only file");
});
