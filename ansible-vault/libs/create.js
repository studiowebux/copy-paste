/* Studio Webux S.E.N.C 2022 */

const { readFileSync, writeFileSync } = require('fs');
const { prompt } = require('inquirer');
const path = require('path');
const jsYaml = require('js-yaml');

const {
  saveConfiguration,
  readConfiguration,
  getType,
} = require('./configuration');
const { normalizePath, searchRoot } = require('./utils');
const { encryptString } = require('./encrypt');

const currentPath = process.cwd();

async function createNewConfiguration() {
  const newServiceAnswers = await prompt([
    {
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
    const vAnswer = await prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to override the existing configuration',
      },
    ]);
    verification = vAnswer.confirm;
  }

  if (verification) {
    saveConfiguration(currentConfiguration, newServiceAnswers, idx);
  } else {
    console.log('Configuration not saved.');
  }
}

async function createNewVault(templateToUse, output = null) {
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

  const answers = await prompt([
    {
      type: 'input',
      name: 'targetFilePath',
      message: 'Location to save the vault',
      default: path.join(process.cwd(), 'vault.yml'),
      when: !output,

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
      type: getType({
        choices: q.choices,
        type: q.type,
        stringType: q.string_type,
      }),
    })),
  ]);

  const result = questions.map((q) => {
    // eslint-disable-next-line no-param-reassign
    q.value = answers[q.id];

    // eslint-disable-next-line no-param-reassign
    delete q.id;
    // eslint-disable-next-line no-param-reassign
    delete q.choices;

    return q;
  });

  const yaml = jsYaml.dump({ parameters: result }, { lineWidth: Infinity });

  writeFileSync(path.join(output || answers.targetFilePath), yaml, 'utf-8');

  console.log(`File saved to ${path.join(output || answers.targetFilePath)}`);
}

async function createNewVaultString(templateToUse, output = null) {
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

  const answers = await prompt([
    {
      type: 'input',
      name: 'targetFilePath',
      message: 'Location to save the vault',
      default: path.join(process.cwd(), 'vault.yml'),
      when: !output,

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
      type: getType({
        choices: q.choices,
        type: q.type,
        stringType: q.string_type,
      }),
    })),
    {
      type: 'password',
      name: 'yat_vault_string_password',
      message: 'Vault Password',
    },
  ]);

  const password = answers.yat_vault_string_password;

  const result = questions
    .filter((qq) => qq.name !== 'yat_vault_string_password')
    .map((q) => {
      if (q.string_type === 'SecureString') {
        // eslint-disable-next-line no-param-reassign
        q.value = encryptString(answers[q.id], password);
      } else if (q.string_type === 'StringList') {
        // eslint-disable-next-line no-param-reassign
        q.value = answers[q.id].join(',');
      } else {
        // eslint-disable-next-line no-param-reassign
        q.value = answers[q.id];
      }
      // eslint-disable-next-line no-param-reassign
      delete q.id;
      // eslint-disable-next-line no-param-reassign
      delete q.choices;
      return q;
    });

  const yaml = jsYaml.dump({ parameters: result }, { lineWidth: Infinity });

  writeFileSync(path.join(output || answers.targetFilePath), yaml, 'utf-8');

  console.log(`File saved to ${path.join(output || answers.targetFilePath)}`);
}

module.exports = {
  createNewConfiguration,
  createNewVault,
  createNewVaultString,
};
