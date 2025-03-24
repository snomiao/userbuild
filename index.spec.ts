import userBuild from ".";
it("works", async () => {
  await userBuild("tests/example.user.ts", "--outdir=tests");
  const code = await Bun.file("tests/example.user.js").text();

  expect(code).not.toContain("import md5 from 'md5';");

  expect(code).toContain("SHOULD_INCLUDE_COMMENT_AFTER_BANNER");
  expect(code).not.toContain("SHOULD_NOT_INCLUDE_COMMENT_IN_CODE");
});
