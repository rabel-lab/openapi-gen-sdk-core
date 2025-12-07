import { BaseAdapter } from '@/config/adapters/base';
import { DefaultAdapter } from '@/config/adapters/defaultAdapter';
import { defaultOpenapiGenConfig } from '@/config/default';
import { OpenapiGenConfig } from '@/config/type';
import { mergeWithDefaults } from '@/config/utils';

type Adapter = BaseAdapter;

type ConfigOptions = {
  adapter?: Adapter;
  config?: OpenapiGenConfig;
};

export class Config {
  private adapter: Adapter;
  private default: Required<OpenapiGenConfig> = defaultOpenapiGenConfig;
  private resolved: Promise<Required<OpenapiGenConfig>> | Required<OpenapiGenConfig> =
    defaultOpenapiGenConfig;
  constructor(options?: ConfigOptions) {
    this.adapter = options?.adapter ?? new DefaultAdapter();
    this.load();
  }
  /**
   * Apply default config.
   * @returns - OpenapiGenConfig
   */
  private async applyDefault() {
    this.resolved = mergeWithDefaults(this.default, await Promise.resolve(this.resolved));
  }
  /**
   * Load config from adapters.
   * @returns - OpenapiGenConfig
   */
  private async applyAdapter() {
    const adapter = this.adapter;
    if (!adapter) {
      console.log('No adapter found');
      return;
    }
    const transformer = await adapter.transform(await Promise.resolve(this.resolved));
    console.log('transformer', transformer, adapter.name);
    this.resolved = transformer;
  }
  /**
   * Load config from adapters.
   * @returns - OpenapiGenConfig
   */
  private async load() {
    await this.applyDefault();
    await this.applyAdapter();
  }
  /**
   * Get resolved config.
   * @returns - OpenapiGenConfig
   */
  async getConfig() {
    return await Promise.resolve(this.resolved);
  }
}
