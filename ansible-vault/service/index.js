#!/usr/bin/env node

/* Studio Webux S.E.N.C 2022 */

const { selectConfiguration } = require('../libs/configuration');
const {
  createNewConfiguration,
  createNewVault,
  createNewVaultString,
} = require('../libs/create');

(async () => {
  try {
    const action = process.argv.splice(2)[0];

    switch (action) {
      case 'create':
        await createNewConfiguration();
        break;
      case 'generate':
        await createNewVault(await selectConfiguration());
        break;
      case 'generate-string':
        await createNewVaultString(await selectConfiguration());
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
