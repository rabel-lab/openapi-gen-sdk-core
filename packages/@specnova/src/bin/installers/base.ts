import { Command } from 'commander';

type CLIOptionName = string;

type WithStringInput = {
  withInput: true;
  defaultValue?: string;
};

type WithBooleanInput = {
  withInput?: false;
  defaultValue?: never;
};

type WithValue = WithStringInput | WithBooleanInput;

type CLIOptionValue = {
  flag: string;
  description: string;
} & WithValue;

type CLIOption = Record<CLIOptionName, CLIOptionValue>;

type CLIOptionResult<O extends CLIOption> = {
  [K in keyof O]: O[K]['withInput'] extends true ? string : boolean;
};

type CLIArgument = {
  name: string;
  optional?: boolean;
  description?: string;
};

type CLIActionOptionsOnly<O extends CLIOption> = (args: CLIOptionResult<O>) => Promise<void>;
type CLIOptionValueWithValue<O extends CLIOption> = (
  name: string,
  options: CLIOptionResult<O>,
) => Promise<void>;

type CLIAction<O extends CLIOption, A extends CLIArgument> = A extends undefined
  ? CLIActionOptionsOnly<O>
  : CLIOptionValueWithValue<O>;

type InstallerOptions<O extends CLIOption, A extends CLIArgument> = {
  name: string;
  description: string;
  argument?: A;
  options: O;
  action: CLIAction<O, A>;
};

type Installer = (program: Command) => void;

const createArugmentFlag = (argument: CLIArgument) => {
  const isOptional = argument.optional;
  let arg;
  if (isOptional) {
    arg = `[${argument.name}]`;
  } else {
    arg = `<${argument.name}>`;
  }
  return arg;
};
const createOptionFlag = (option: CLIOptionValue & { name: string }) => {
  const hasValue = option.withInput === true;
  let flag = `-${option.flag} --${option.name}`;
  if (hasValue) {
    flag += ` <${option.name}>`;
  }
  return flag;
};

function createOptionDefaultValue(option: CLIOptionValue) {
  if (option.withInput === true) {
    return option.defaultValue ?? '';
  } else {
    return false;
  }
}

export function defineCliInstaller<O extends CLIOption, A extends CLIArgument>(
  installer: InstallerOptions<O, A>,
): Installer {
  return (program) => {
    // Start command
    const cmd = program.command(installer.name).description(installer.description);
    // Add arguments
    if (installer.argument) {
      cmd.argument(createArugmentFlag(installer.argument), installer.argument.description);
    }
    // Add options
    const entries = Object.entries(installer.options);
    for (const [name, value] of entries) {
      cmd.option(
        createOptionFlag({ name, ...value }),
        value.description,
        createOptionDefaultValue(value),
      );
    }
    // End command
    cmd.action(installer.action);
  };
}
