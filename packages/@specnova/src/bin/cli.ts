#!/usr/bin/env node

import installSync from '@/bin/installers/pull';
import { NpmPackage } from '@/npm';

import { Command } from 'commander';

const program = new Command();
program.name('specnova').description('SpecNova CLI').version(NpmPackage.getPackage().version);

// Installers
installSync(program);

program
  .command('test')
  .description('Test')
  .action(async () => {
    console.log('test');
  });

program.parse(process.argv);
