import { handler } from '@/plugins/plugin';
import { OpenapiGenPlugin } from '@/plugins/types';

import { definePluginConfig } from '@hey-api/openapi-ts';

export const openapiGenConfigName: OpenapiGenPlugin['Config']['name'] = '@openapiGen/core';
export const defaultOpenapiGenConfig: OpenapiGenPlugin['Config'] = {
  name: openapiGenConfigName,
  config: {
    syncVersion: false,
    mergeInputs: false,
    parser: {
      operationId: undefined,
      sort: undefined,
      filter: undefined,
      reject: undefined,
    },
    snapshot: {
      enabled: true,
      folder: './snapshots',
      versionStrategy: 'infer-semver', // or "manual"
    },
  },
  handler: handler,
};

export const defineOpenapiGenConfig = definePluginConfig(defaultOpenapiGenConfig);
