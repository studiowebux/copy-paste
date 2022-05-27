/* Studio Webux S.E.N.C 2022 */

const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');
const { prompt } = require('inquirer');
const { searchRoot } = require('./utils');

function createConfiguration() {
  mkdirSync(path.join(searchRoot(process.cwd()).path, '.yat_config'), {
    recursive: true,
  });
  writeFileSync(
    path.join(searchRoot(process.cwd()).path, '.yat_config', 'templates.json'),
    '[]',
    'utf-8',
  );
  return '[]';
}

function readConfiguration() {
  try {
    return readFileSync(
      path.join(
        searchRoot(process.cwd()).path,
        '.yat_config',
        'templates.json',
      ),
      'utf-8',
    );
  } catch (e) {
    if (e.code === 'ENOENT') {
      return createConfiguration();
    }
    throw e;
  }
}

function saveConfiguration(currentConfiguration, configuration, idx = -1) {
  if (idx === -1) {
    // Create new Entry
    currentConfiguration.push({
      ServiceName: configuration.ServiceName,
      JSONTemplatePath: configuration.JSONTemplatePath.split(
        searchRoot(process.cwd()).path,
      ).reverse()[0],
    });
  } else {
    // Update existing entry
    // eslint-disable-next-line no-param-reassign
    currentConfiguration[idx] = {
      ServiceName: configuration.ServiceName,
      JSONTemplatePath: configuration.JSONTemplatePath.split(
        searchRoot(process.cwd()).path,
      ).reverse()[0],
    };
  }

  writeFileSync(
    path.join(searchRoot(process.cwd()).path, '.yat_config', 'templates.json'),
    JSON.stringify(currentConfiguration),
    'utf-8',
  );

  console.log(`Configuration Saved !`);
}

async function selectConfiguration() {
  const choices = JSON.parse(readConfiguration());

  const templateToStartFrom = await prompt([
    {
      type: 'list',
      name: 'Template',
      message: 'Select a template',
      choices: choices.map((c) => c.ServiceName),
    },
  ]);

  return templateToStartFrom.Template;
}

function getType({ choices, type, stringType }) {
  if (!type && choices && choices.length > 0) {
    // Default behaviour when choices are defined
    return 'list';
  }

  if (!type && stringType && stringType === 'SecureString') {
    // This is the default behaviour for SecureString, but if the user has provided a type we use the type as well.
    // Useful to use the editor for multi-line secrets such as private keys
    return 'password';
  }

  switch (type) {
    case 'input':
      return 'input';
    case 'list':
      return 'list';
    case 'checkbox':
      return 'checkbox';
    case 'password':
      return 'password';
    case 'editor':
      return 'editor';
    default:
      return 'input';
  }
}

module.exports = {
  saveConfiguration,
  readConfiguration,
  selectConfiguration,
  getType,
};
