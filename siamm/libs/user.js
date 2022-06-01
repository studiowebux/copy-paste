// Studio Webux S.E.N.C @ 2022

const {
  CreateUserCommand,
  DeleteUserCommand,
  ListAttachedUserPoliciesCommand,
  ListGroupsForUserCommand,
} = require('@aws-sdk/client-iam');
const { addToGroup, detachGroups, removeFromGroup } = require('./group');
const { detachPolicies, attachPolicy, detachPolicy } = require('./policy');

async function createUser(client, content, username) {
  await client.send(new CreateUserCommand({ UserName: username }));

  const processing =
    content?.groups?.map((group) => addToGroup(username, group)) || [];

  const groups = await Promise.all(processing);

  return groups;
}

async function createUsers(client, content, users) {
  const processing = users.map((u) =>
    createUser(
      client,
      content.filter((data) => data.username === u.username)[0],
      u.username,
    ),
  );
  const newUsers = await Promise.all(processing);

  return newUsers;
}

async function deleteUser(client, username) {
  await detachGroups(client, username);
  await detachPolicies(client, username);
  return client.send(new DeleteUserCommand({ UserName: username }));
}

async function deleteUsers(client, users) {
  const processing = users.map((u) => deleteUser(client, u.UserName));
  await Promise.all(processing);
}

async function updateUser(client, account, username, user) {
  const groups = await client.send(
    new ListGroupsForUserCommand({ UserName: username }),
  );

  const groupsFetched = groups.Groups.map((group) => group.GroupName);

  const missingLocally =
    groupsFetched.filter((gf) => !user?.groups?.some((ug) => ug === gf)) || [];
  const missingRemotely =
    user?.groups?.filter((ug) => !groupsFetched.some((gf) => gf === ug)) || [];
  const synced =
    user?.groups?.filter((ug) => groupsFetched.some((gf) => gf === ug)) || [];

  console.log(
    username,
    'Group(s) to delete',
    missingLocally.join(', ') || '[None]',
  );
  console.log(
    username,
    'Group(s) to add',
    missingRemotely.join(', ') || '[None]',
  );
  console.log(username, 'Group(s) Synced', synced.join(', ') || '[None]');

  const processAddition = missingRemotely.map((mr) => addToGroup(username, mr));
  await Promise.all(processAddition);

  const processDeletion = missingLocally.map((ml) =>
    removeFromGroup(client, username, ml),
  );
  await Promise.all(processDeletion);

  //   --- Manage Policies ---

  const managePolicies = await client.send(
    new ListAttachedUserPoliciesCommand({ UserName: username }),
  );

  const managePoliciesFetched = managePolicies.AttachedPolicies.map(
    (policy) => policy,
  );

  const managedPolicyMissingLocally =
    managePoliciesFetched.filter(
      (mpf) => !user?.policies?.some((mp) => mp === mpf.PolicyName),
    ) || [];
  const managePoliciesMissingRemotely =
    user?.policies?.filter(
      (mp) => !managePoliciesFetched.some((mpf) => mpf.PolicyName === mp),
    ) || [];
  const managedPoliciesSynced =
    user?.policies?.filter((mp) =>
      managePoliciesFetched.some((mpf) => mpf.PolicyName === mp),
    ) || [];

  console.log(
    username,
    'Manage Policies(s) to delete',
    managedPolicyMissingLocally.join(', ') || '[None]',
  );
  console.log(
    username,
    'Manage Policies(s) to add',
    managePoliciesMissingRemotely.join(', ') || '[None]',
  );
  console.log(
    username,
    'Manage Policies(s) Synced',
    managedPoliciesSynced.join(', ') || '[None]',
  );

  const managePoliciesProcessAddition = managePoliciesMissingRemotely.map(
    (mr) => attachPolicy(client, account, username, mr),
  );
  await Promise.all(managePoliciesProcessAddition);

  const managePoliciesProcessDeletion = managedPolicyMissingLocally.map((ml) =>
    detachPolicy(client, username, ml.PolicyArn),
  );
  await Promise.all(managePoliciesProcessDeletion);
}

async function updateUsers(client, account, users) {
  const processing = users.map((user) =>
    updateUser(client, account, user.username, user),
  );

  await Promise.all(processing);
}

module.exports = {
  createUsers,
  createUser,
  deleteUser,
  deleteUsers,
  updateUser,
  updateUsers,
};
