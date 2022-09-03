#!/usr/bin/env node

// Studio Webux S.E.N.C @ 2022

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const fs = require('fs');
const { IAMClient, ListUsersCommand } = require('@aws-sdk/client-iam');
const { STSClient } = require('@aws-sdk/client-sts');
const { assumeRole, getIdentity } = require('./libs/sts');
const { createUsers, deleteUsers, updateUsers } = require('./libs/user');

const { argv } = yargs(hideBin(process.argv));

let iam = new IAMClient();
let sts = new STSClient();

let account = argv.accountId?.toString();

(async () => {
  try {
    const template = argv.t || argv.template;
    if (!template) throw new Error('Missing template path');

    const content = JSON.parse(
      fs.readFileSync(path.resolve(template), 'utf-8'),
    );

    if (!account) {
      account = await getIdentity(sts);
    }

    if (argv.assumeRole) {
      const clients = await assumeRole(sts, account, argv.assumeRole);
      iam = clients.iam;
      sts = clients.sts;
    }

    // TODO: Implement recursive to get all users
    const existingUsers = await iam.send(new ListUsersCommand({}));

    const missingLocally = existingUsers.Users.filter(
      (user) => !content.some((c) => c.username === user.UserName),
    );
    const missingRemotely = content.filter(
      (user) => !existingUsers.Users.some((c) => c.UserName === user.username),
    );
    const synced = content.filter((user) =>
      existingUsers.Users.some((c) => c.UserName === user.username),
    );

    console.log('Users:');

    console.log(
      `User(s) to delete: ${
        `[${missingLocally.map((u) => u.UserName).join(', ')}]` || '[None]'
      } (${missingLocally.length})`,
    );
    console.log(
      `User(s) to add: ${
        `[${missingRemotely.map((u) => u.username).join(', ')}]` || '[None]'
      } (${missingRemotely.length})`,
    );

    console.log(
      `User(s) to update: ${
        `[${synced.map((u) => u.username).join(', ')}]` || '[None]'
      } (${synced.length})`,
    );

    await createUsers(iam, content, missingRemotely, account, argv.create);

    if (argv.cleanup) {
      await deleteUsers(iam, missingLocally);
    }

    await updateUsers(iam, account, synced, argv.update);

    console.log('\nVoila !');

    process.exit(0);
  } catch (e) {
    // console.error(e.stack);
    console.error('[ERROR]', e.message);
    process.exit(1);
  }
})();
