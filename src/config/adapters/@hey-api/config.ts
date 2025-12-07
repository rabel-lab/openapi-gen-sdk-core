import { handler } from '@/config/adapters/@hey-api/plugin';
import { HeyApiPlugin, heyApiPluginName } from '@/config/adapters/@hey-api/type';
import { defaultOpenapiGenConfig } from '@/config/default';
import { OpenapiGenConfig } from '@/config/type';

import { definePluginConfig } from '@hey-api/openapi-ts';

const defaultHeyApiConfig: HeyApiPlugin['Config'] = {
  name: heyApiPluginName,
  handler: handler,
  config: defaultOpenapiGenConfig,
};

/**
 * Type helper for `my-plugin` plugin, returns {@link Plugin.Config} object
 */
const definedConfig = definePluginConfig(defaultHeyApiConfig);

export const defineSpecNovaHeyApiPlugin = (config: OpenapiGenConfig) => definedConfig(config);
