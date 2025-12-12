import { BaseAdapter } from '@/config/adapters/base';
import { DefaultAdapter } from '@/config/adapters/defaultAdapter';
import { defaultSpecnovaGenConfig } from '@/config/default';
import { loadEnvConfig } from '@/config/env';
import { ResolvedSpecnovaConfig, SpecnovaConfig } from '@/config/type';
import { mergeWithDefaults } from '@/config/utils';

type Adapter = BaseAdapter;

type ConfigOptions = {
  adapter?: Adapter;
  config?: Partial<SpecnovaConfig>;
};

// Apply & load env config
await loadEnvConfig();

export class Config {
  private adapter: Adapter;
  private resolved: Promise<ResolvedSpecnovaConfig> | ResolvedSpecnovaConfig;

  //-> Static Helpers
  static getConfigRootDir(subPath?: string): string {
    const path = subPath ? subPath : process.env.SPECNOVA_CONFIG_PATH;
    return `${process.cwd()}${path ? `/${path}` : ''}`;
  }

  constructor(options?: ConfigOptions) {
    this.adapter = options?.adapter ?? new DefaultAdapter();
    this.resolved = mergeWithDefaults(defaultSpecnovaGenConfig, options?.config ?? {});
  }
  /**
   * Load config from adapters.
   * @returns - SpecnovaGenConfig
   */
  private async applyAdapter() {
    const adapter = this.adapter;
    if (!adapter) {
      return;
    }
    const transformer = await adapter.transform(await Promise.resolve(this.resolved));
    this.resolved = transformer;
  }
  /**
   * Load config from adapters.
   * @returns - SpecnovaGenConfig
   */
  public async load() {
    await this.applyAdapter();
    return this;
  }
  /**
   * Get resolved config.
   * @returns - SpecnovaGenConfig
   */
  async getConfig() {
    return await Promise.resolve(this.resolved);
  }
}
