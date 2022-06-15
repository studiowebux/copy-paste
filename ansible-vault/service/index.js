#!/usr/bin/env node

/* Studio Webux S.E.N.C 2022 */
const argv = require('minimist')(process.argv.slice(2));

const { selectConfiguration } = require('../libs/configuration');
const {
  createNewConfiguration,
  createNewVault,
  createNewVaultString,
} = require('../libs/create');

(async () => {
  try {
    switch (argv._[0]) {
      case 'create':
        await createNewConfiguration();
        break;
      case 'generate':
        await createNewVault(
          argv.template || (await selectConfiguration()),
          argv.output,
        );
        break;
      case 'generate-string':
        await createNewVaultString(
          argv.template || (await selectConfiguration()),
          argv.output,
        );
        break;
      default:
        throw new Error('No action provided.');
    }
  } catch (e) {
    if (e.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment");
    }
    console.error(e.message);
    process.exit(1);
  }
})();
