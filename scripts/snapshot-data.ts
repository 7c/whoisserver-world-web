import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join, resolve } from 'path';

import type { TldData } from 'whoisserver-world';

const require = createRequire(import.meta.url);

function loadPackagePath(): string {
  const pkgPath = require.resolve('whoisserver-world/package.json');
  return dirname(pkgPath);
}

function writeJson(path: string, payload: unknown) {
  writeFileSync(path, JSON.stringify(payload, null, 2));
}

async function main() {
  const pkgRoot = loadPackagePath();
  const aggregatedPath = join(pkgRoot, 'whoisservers.json');
  const perTldDir = join(pkgRoot, 'tlds');

  const outDir = resolve(process.cwd(), 'src/data');
  const outTldDir = join(outDir, 'tlds');

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outTldDir, { recursive: true });

  const aggregated = JSON.parse(readFileSync(aggregatedPath, 'utf8')) as Record<string, TldData>;
  writeJson(join(outDir, 'whoisservers.json'), aggregated);

  const files = readdirSync(perTldDir).filter((file) => file.endsWith('.json'));
  for (const file of files) {
    const sourcePath = join(perTldDir, file);
    const payload = JSON.parse(readFileSync(sourcePath, 'utf8')) as TldData;
    writeJson(join(outTldDir, file), payload);
  }

  console.log(`Snapshot ${files.length} TLD records from whoisserver-world into ${outTldDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
