import { parseSource } from '@/core';
import { infoExtracter } from '@/core/extracter';
import { NpmPackage } from '@/npm/base';

export async function syncPatch() {
  const { source: pkgSpecnovaSource } = NpmPackage.getPackage().specnova;
  const specnovaSource = await parseSource(pkgSpecnovaSource);
  const { version } = infoExtracter.extract(specnovaSource.parseResult);
  console.log(`🔀 Syncing patch for ${version}`);
  console.log(`🔧 Synced patch to ${version}`);
}

export async function syncVersion() {
  const pkg = new NpmPackage();
  const { version: pkgSpecnovaVersion, source: pkgSpecnovaSource } =
    NpmPackage.getPackage().specnova;
  const SpecnovaSource = await parseSource(pkgSpecnovaSource);
  const { version } = infoExtracter.extract(SpecnovaSource.parseResult);
  console.log(`🔀 Syncing version for ${pkgSpecnovaVersion} → ${version}`);
  pkg.editPackage({ version });
  console.log(`🔧 Synced version to ${version}`);
}
