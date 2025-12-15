import { defineCliInstaller } from '@/bin/installers/base';

export default defineCliInstaller({
  name: 'fetch',
  description: 'Download the latest version of the Spec origin.',
  argument: {
    name: 'patch',
    optional: true,
  },
  options: {
    patch: {
      flag: 'p',
      description: 'Sync patch file from OpenAPI spec',
    },
  },
  async action(name, options) {},
});
