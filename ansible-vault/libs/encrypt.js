/* Studio Webux S.E.N.C 2022 */

const { Vault } = require('ansible-vault');

function encryptString(value, password) {
  return new Vault({
    password: password || process.env.VAULT_PASS,
  }).encryptSync(value);
}

module.exports = {
  encryptString,
};
