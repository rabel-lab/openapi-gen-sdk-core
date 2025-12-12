import { parseSource } from '@/core';
import { infoExtracter } from '@/core/extracter';
import { NpmPackage } from '@/npm/base';

import { execSync } from 'child_process';

export async function ciCheck() {
  const { version: pkgSpecnovaVersion, source: pkgSpecnovaSource } =
    NpmPackage.getPackage().specnova;
  const { parseResult } = await parseSource(pkgSpecnovaSource);
  const externalVersion = infoExtracter.extract(parseResult).version;
  if (pkgSpecnovaVersion === externalVersion) {
    console.log('✅ Local patch is up to date.');
    return false;
  }
  console.log(`🚨 Update available: ${pkgSpecnovaVersion} → ${externalVersion}`);
  return true;
}

export async function ciUpdate() {
  const pkg = new NpmPackage();
  const { source: pkgSpecnovaSource } = NpmPackage.getPackage().specnova;
  const specnovaSource = await parseSource(pkgSpecnovaSource);
  const version = infoExtracter.extract(specnovaSource.parseResult).version;
  pkg.editPackage({ version });
  return version;
}

export async function ciGenerate() {
  console.log('📦 Generating SDK with `pnpm run gen`...');
  execSync('pnpm run gen', { stdio: 'inherit' });
  console.log('✅ SDK generation complete.');
}
