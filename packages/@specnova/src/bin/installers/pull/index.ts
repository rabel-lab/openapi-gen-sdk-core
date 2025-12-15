import { defineCliInstaller } from '@/bin/installers/base';

export default defineCliInstaller({
  name: 'pull',
  description: 'Download the latest version of the Spec origin & update the target path.',
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
