#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const path = require('path');
const fs = require('fs');
const {
  IAMClient,
  ListUsersCommand,
  AddUserToGroupCommand,
  RemoveUserFromGroupCommand,
  CreateUserCommand,
  DeleteUserCommand,
  ListGroupsForUserCommand,
} = require('@aws-sdk/client-iam');

const client = new IAMClient();

async function addToGroup(username, group) {
  //   console.log('addToGroupe', username, group);
  return client.send(
    new AddUserToGroupCommand({ UserName: username, GroupName: group }),
  );
}

async function removeFromGroup(username, group) {
  //   console.log('removeFromGroup', username, group);
  return client.send(
    new RemoveUserFromGroupCommand({ UserName: username, GroupName: group }),
  );
}

async function createUser(content, username) {
  //   console.log('createUser', content, username);
  await client.send(new CreateUserCommand({ UserName: user.username }));

  const processing = content.groups.map((group) => addToGroup(username, group));

  const groups = await Promise.all(processing);

  return groups;
}

async function createUsers(content, users) {
  //   console.log('createUsers', content, users);
  const processing = users.map((u) =>
    createUser(
      content.filter((data) => data.username === u.username)[0],
      u.username,
    ),
  );
  const newUsers = await Promise.all(processing);

  return newUsers;
}

async function deleteUser(username) {
  //   console.log('deleteUser', username);
  return client.send(new DeleteUserCommand({ UserName: username }));
}

async function deleteUsers(content, users) {
  //   console.log('deleteUsers', content, users);
  const processing = users.map((u) => deleteUser(u.UserName));
  await Promise.all(processing);
}

async function updateUser(username, userGroups) {
  //   console.log('updateUser', username, userGroups);
  const groups = await client.send(
    new ListGroupsForUserCommand({ UserName: username }),
  );

  const groupsFetched = groups.Groups.map((group) => group.GroupName);

  const missingLocally = groupsFetched.filter(
    (gf) => !userGroups.some((ug) => ug === gf),
  );
  const missingRemotely = userGroups.filter(
    (ug) => !groupsFetched.some((gf) => gf === ug),
  );
  const synced = userGroups.filter((ug) =>
    groupsFetched.some((gf) => gf === ug),
  );

  console.log(username, 'Group(s) to delete', missingLocally);
  console.log(username, 'Group(s) to add', missingRemotely);
  console.log(username, 'Group(s) Synced', synced);

  const processAddition = missingRemotely.map((mr) => addToGroup(username, mr));
  await Promise.all(processAddition);

  const processDeletion = missingLocally.map((ml) =>
    removeFromGroup(username, ml),
  );
  await Promise.all(processDeletion);
}

async function updateUsers(content, users) {
  //   console.log('updateUsers', content, users);

  const processing = users.map((user) =>
    updateUser(user.username, user.groups),
  );

  await Promise.all(processing);
}

(async () => {
  try {
    const template = argv.t || argv.template;
    if (!template) throw new Error('Missing template path');

    console.debug(`Loading ${path.resolve(template)}`);
    const content = JSON.parse(
      fs.readFileSync(path.resolve(template), 'utf-8'),
    );

    // TODO: Implement recursive to get all users
    const existingUsers = await client.send(new ListUsersCommand({}));

    // console.debug(existingUsers.Users);

    const missingLocally = existingUsers.Users.filter(
      (user) => !content.some((c) => c.username === user),
    );
    const missingRemotely = content.filter(
      (user) => !existingUsers.Users.some((c) => c.UserName === user.username),
    );
    const synced = content.filter((user) =>
      existingUsers.Users.some((c) => c.UserName === user.username),
    );

    console.log(
      `User(s) to delete: ${missingLocally.map((u) => u.UserName)} (${
        missingLocally.length
      })`,
    );
    console.log(
      `User(s) to add: ${missingRemotely.map((u) => u.username)} (${
        missingRemotely.length
      })`,
    );

    // console.log(argv);

    if (argv.create) {
      await createUsers(content, missingRemotely);
    }
    if (argv.cleanup) {
      await deleteUsers(content, missingLocally);
    }

    await updateUsers(content, synced);

    process.exit(0);
  } catch (e) {
    // console.error(e.stack);
    console.error('[ERROR]', e.message);
    process.exit(1);
  }
})();
