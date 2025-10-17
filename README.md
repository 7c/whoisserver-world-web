# Web JSON Library Demo

This repository demonstrates how to ship a browser-friendly TypeScript library that wraps the
[`whoisserver-world`](https://www.npmjs.com/package/whoisserver-world) dataset. The upstream package
ships hundreds of per‑TLD JSON files and reads them at runtime via `fs`; the code here snapshots
those assets and bakes them into a bundle that can run in any browser.

## Project layout

- `scripts/snapshot-data.ts` – snapshots the upstream `whoisserver-world` JSON data into `src/data`.
- `src/` – the browser-ready library that statically imports the dataset and re-implements the API surface.
- `demo/` – a tiny Vite page that exercises the static bundle in the browser.

## Getting started

```bash
npm install
npm i --save whoisserver-world ## to update whoisserver-world main library from time2time
npm run typecheck ## check for TypeScript errors
# materialise JSON files under src/data (requires Node 18+ and npx tsx)
npm run snapshot:data   ## this is required!
npm run build           # emit dist/whoisserver-world-web.{mjs,cjs} plus type declarations
npm run dev     # start dev server at http://localhost:5174/demo/index.html
```

If your environment restricts Unix sockets (some sandboxes do), run the snapshot step directly:

```bash
node --experimental-strip-types scripts/snapshot-data.ts
```

The snapshot step copies `whoisservers.json` and every TLD JSON file into `src/data`. During the Vite
build `import.meta.glob` eagerly pulls those files into the bundle, eliminating any runtime `fs`
access.

## Using the library

### Functional helpers

```ts
import { tldDetails, parseDomain, tlds } from 'whoisserver-world-web';

const registry = tlds();
console.log(Object.keys(registry).length);        // -> total TLD count
console.log(tldDetails('dev'));                   // -> data for .dev
console.log(parseDomain('registry.example.dev')); // -> DomainParseResult
```

### Object-oriented wrapper

```ts
import { Domainname } from 'whoisserver-world-web';

const domain = new Domainname('registry.example.dev');

console.log(domain.hostname);  // parsed + normalized hostname
console.log(domain.tld);   // TLD metadata
console.log(domain.domain);   // Domain metadata
console.log(Domainname.isValid('bad-example')); // false
```

You can publish this package to GitHub and npm as-is. The bundled output lives in `dist/` and the
`exports` map in `package.json` points consumers to the correct files for ESM, CJS, and TypeScript.
