# UserScript Builder CLI

A command-line tool designed to transform `*.user.ts` files into bundled `*.user.js` files in a human-readable format. This utility is especially useful for developers working with UserScripts, ensuring that their scripts are properly compiled and include the necessary metadata headers for UserScript managers like Tampermonkey or Greasemonkey.

## Features

- **Compiles TypeScript UserScripts**: Convert TypeScript (`*.user.ts`) into a bundled JavaScript file (`*.user.js`).
- **Preserves UserScript Metadata**: Extracts and retains the UserScript metadata headers to ensure compatibility with UserScript managers.
- **Human-Readable Output**: Generates JavaScript output that is easy to read and debug.

## Usage

To use the UserScript Builder CLI, you can execute it with the desired entry point file and optional Bun build arguments. The entry point should be a `*.user.ts` TypeScript file that includes UserScript metadata.

```bash
bunx userbuild <entrypoint> -- [bunArgs..]
```

- `<entrypoint>`: The path to your TypeScript UserScript file.
- `[bunArgs]`: Optional additional arguments to pass to the Bun build process.

### Example

```bash
bunx userbuild src/demo.user.ts -- --minify
```

This command will compile `src/demo.user.ts` into a bundled `src/demo.user.js`, maintaining the UserScript metadata and applying any specified Bun build options.

## Developer

- **Author**: Snomiao ([snomiao@gmail.com](mailto:snomiao@gmail.com))

## Note

Ensure that your TypeScript UserScript files contain valid UserScript metadata headers, following the format recognized by UserScript managers, such as:

```ts
// ==UserScript==
// @name        Example Script
// @namespace   http://example.com/
// @version     1.0
// @description An example UserScript
// @match       http://example.com/*
// ==/UserScript==
```

These headers are crucial for the correct functioning of the bundled JavaScript file within UserScript managers.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.