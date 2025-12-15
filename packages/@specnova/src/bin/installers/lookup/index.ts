import { defineCliInstaller } from '@/bin/installers/base';

export default defineCliInstaller({
  name: 'lookup',
  description: 'Lookup the spec origin.',
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
