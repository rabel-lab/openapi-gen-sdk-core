import { ResolvedSpecnovaConfig as ResolvedSpecnovaConfig } from '@/config/type';
import { defaultParserConfig } from '@/core/parser/config';
import { defaultSnapshotConfig } from '@/core/snapshot/config';

export const defaultSpecnovaGenConfig = {
  configFile: 'specnova.config',
  syncVersion: false,
  mergeInputs: false,
  normalized: defaultParserConfig,
  snapshot: defaultSnapshotConfig,
} satisfies ResolvedSpecnovaConfig;
