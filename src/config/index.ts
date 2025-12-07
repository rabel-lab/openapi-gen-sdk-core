import { Config } from '@/config/base';

const resolvedConfig = await new Config().getConfig();

export default resolvedConfig;
