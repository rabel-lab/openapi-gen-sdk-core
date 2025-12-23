import semverTool from 'semver';
import z from 'zod';

export const semver = z.string().check(
  z.trim(),
  z.refine((val) => semverTool.valid(semverTool.coerce(val)), 'Invalid semver version'),
);

export type Semver = z.infer<typeof semver>;
