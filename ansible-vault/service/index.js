#!/usr/bin/env node

/* Studio Webux S.E.N.C 2022 */

const {
  readFileSync,
  writeFileSync
} = require('fs');
const {
  prompt
} = require('inquirer');
const path = require('path');
const jsYaml = require('js-yaml');

const {
  saveConfiguration,
  readConfiguration,
  selectConfiguration,
} = require('../libs/configuration');
const {
  normalizePath,
  searchRoot
} = require('../libs/utils');

const currentPath = process.cwd();

async function createNewConfiguration() {

  const newServiceAnswers = await prompt([{
      type: 'input',
      name: 'ServiceName',
      message: 'Name of your new template',
      validate: (input) => {
        if (/^([A-Za-z-])+$/.test(input)) {
          return true;
        }
        return 'The module name may only include letters or dashes';
      },
    },
    {
      type: 'input',
      name: 'JSONTemplatePath',
      message: 'Location of your template',
      default: path.join(currentPath, 'templates'),

      validate: (input) => {
        if (path.extname(input) === '.json') {
          return true;
        }
        return 'Must be a JSON file.';
      },
    },
  ]);

  const currentConfiguration = JSON.parse(readConfiguration());
  let verification = true;
  const idx = currentConfiguration.findIndex(
    (cc) => cc.ServiceName === newServiceAnswers.ServiceName,
  );

  if (idx >= 0) {
    const vAnswer = await prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to override the existing configuration',
    }, ]);
    verification = vAnswer.confirm;
  }

  if (verification) {
    saveConfiguration(currentConfiguration, newServiceAnswers, idx);
  } else {
    console.log('Configuration not saved.');
  }
}

async function createNewVault(templateToUse) {
  const template = JSON.parse(readConfiguration()).filter(
    (c) => c.ServiceName === templateToUse,
  );
  if (!template || template.length > 1) {
    throw new Error('Template not found or more than one found.');
  }

  const questions = JSON.parse(
    readFileSync(
      path.join(
        searchRoot(process.cwd()).path,
        normalizePath(template[0].JSONTemplatePath),
      ),
      'utf-8',
    ),
  );

  const answers = await prompt([{
      type: 'input',
      name: 'targetFilePath',
      message: 'Location to save the vault',
      default: path.join(process.cwd(), 'vault.yml'),

      validate: (input) => {
        if (path.extname(input) === '.yml' || path.extname(input) === '.yaml') {
          return true;
        }
        return 'Must be a YAML file.';
      },
    },
    ...questions.map((q) => ({
      name: q.id,
      message: q.message || q.description,
      choices: q.choices || null,
      type: q.choices ? 'list' : 'input',
    })),
  ]);

  const result = questions.map((q) => {
    // eslint-disable-next-line no-param-reassign
    delete q.id;
    // eslint-disable-next-line no-param-reassign
    delete q.choices;
    // eslint-disable-next-line no-param-reassign
    q.value = answers[q.id];
    return q;
  });

  const yaml = jsYaml.dump(result);

  writeFileSync(path.join(answers.targetFilePath), yaml, 'utf-8');

  console.log(`File saved to ${path.join(answers.targetFilePath)}`);
}

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