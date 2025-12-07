import { BaseAdapter, BaseAdapterOptionsWithFile, FileAdapter } from '@/config/adapters/base';
import { defaultOpenapiGenConfig } from '@/config/default';
import { OpenapiGenConfig } from '@/config/type';
import { mergeWithDefaults } from '@/config/utils';

import { loadConfig } from 'c12';
export const defaultAdapterName = 'default';

type ConfigOptions = {
  adapter?: BaseAdapter;
  config?: OpenapiGenConfig;
};

export function defineConfig(ConfigOptions: ConfigOptions): ConfigOptions {
  return ConfigOptions;
}

export class DefaultAdapter extends FileAdapter {
  name: string = defaultAdapterName;
  filePath: string = defaultOpenapiGenConfig.configFile;
  processor: typeof loadConfig<OpenapiGenConfig> = loadConfig;
  constructor(options?: BaseAdapterOptionsWithFile) {
    super(options);
  }
  async transform(externalConfig: Required<OpenapiGenConfig>) {
    const resolvedConfig = await loadConfig<Partial<OpenapiGenConfig>>({
      configFile: this.filePath,
      packageJson: true,
    }).then((res) => res.config ?? {});
    return mergeWithDefaults(externalConfig, resolvedConfig);
  }
}
