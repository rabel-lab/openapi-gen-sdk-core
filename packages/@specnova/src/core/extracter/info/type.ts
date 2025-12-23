import { Semver } from '@/types/semver';

export type Info = {
  title: string;
  version: Semver;
  license?: {
    name: string;
    url: string;
  };
};
