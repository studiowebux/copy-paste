// Studio Webux S.E.N.C @ 2022

const {
  CreateUserCommand,
  DeleteUserCommand,
  ListAttachedUserPoliciesCommand,
  ListGroupsForUserCommand,
} = require('@aws-sdk/client-iam');
const { addToGroup, detachGroups, removeFromGroup } = require('./group');
const { detachPolicies, attachPolicy, detachPolicy } = require('./policy');

async function createUser(client, content, account, username, create) {
  console.log('\nNew User Groups & Managed Policies:');
  console.log(
    username,
    'Group(s) to add',
    `[${content?.groups?.join(', ')}]` || '[None]',
  );
  console.log(
    username,
    'Managed Policies(s) to add',
    `[${content?.policies?.join(', ')}]` || '[None]',
  );

  if (create) {
    console.log(`\n[] Creating '${username}' IAM User`);
    await client.send(new CreateUserCommand({ UserName: username }));
    const processing =
      content?.groups?.map((group) => addToGroup(client, username, group)) ||
      [];

    const groups = await Promise.all(processing);

    const managedPoliciesProcessAddition = content?.policies?.map((policyArn) =>
      attachPolicy(client, account, username, policyArn),
    );
    const policies = await Promise.all(managedPoliciesProcessAddition);

    console.log(`[x] IAM User '${username}' Created`);

    return { groups, policies };
  }

  return null;
}

async function createUsers(client, content, users, account, create) {
  const processing = users.map((u) =>
    createUser(
      client,
      content.filter((data) => data.username === u.username)[0],
      account,
      u.username,
      create,
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

async function updateUser(client, account, username, user, apply) {
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

  console.log('\nGroups:');

  console.log(
    username,
    'Group(s) to delete',
    missingLocally.length !== 0
      ? `[${missingLocally.map((ml) => ml.GroupName).join(', ')}]`
      : '[None]',
  );
  console.log(
    username,
    'Group(s) to add',
    missingRemotely.length !== 0 ? `[${missingRemotely.join(', ')}]` : '[None]',
  );
  console.log(
    username,
    'Group(s) Synced',
    synced.length !== 0 ? `[${synced.join(', ')}]` : '[None]',
  );

  if (apply && (missingLocally.length !== 0 || missingRemotely.length !== 0)) {
    console.log('\n[] Apply Groups Modifications...');
    const processAddition = missingRemotely.map((mr) =>
      addToGroup(client, username, mr),
    );
    await Promise.all(processAddition);

    const processDeletion = missingLocally.map((ml) =>
      removeFromGroup(client, username, ml),
    );
    await Promise.all(processDeletion);

    console.log('[x] Groups Updated');
  }

  //   --- Manage Policies ---

  const managedPolicies = await client.send(
    new ListAttachedUserPoliciesCommand({ UserName: username }),
  );

  const managedPoliciesFetched = managedPolicies.AttachedPolicies.map(
    (policy) => policy,
  );

  const managedPolicyMissingLocally =
    managedPoliciesFetched.filter(
      (mpf) => !user?.policies?.some((mp) => mp === mpf.PolicyName),
    ) || [];
  const managedPoliciesMissingRemotely =
    user?.policies?.filter(
      (mp) => !managedPoliciesFetched.some((mpf) => mpf.PolicyName === mp),
    ) || [];
  const managedPoliciesSynced =
    user?.policies?.filter((mp) =>
      managedPoliciesFetched.some((mpf) => mpf.PolicyName === mp),
    ) || [];

  console.log('\nManaged Policies:');

  console.log(
    username,
    'Managed Policies(s) to delete',
    managedPolicyMissingLocally.length !== 0
      ? `[${managedPolicyMissingLocally
          .map((mpml) => mpml.PolicyName)
          .join(', ')}]`
      : '[None]',
  );
  console.log(
    username,
    'Managed Policies(s) to add',
    managedPoliciesMissingRemotely.length !== 0
      ? `[${managedPoliciesMissingRemotely.join(', ')}]`
      : '[None]',
  );
  console.log(
    username,
    'Managed Policies(s) Synced',
    managedPoliciesSynced.length !== 0
      ? `[${managedPoliciesSynced.join(', ')}]`
      : '[None]',
  );

  if (
    apply &&
    (managedPolicyMissingLocally.length !== 0 ||
      managedPoliciesMissingRemotely.length !== 0)
  ) {
    console.log('\n[] Apply Managed Policies Modifications...');
    const managedPoliciesProcessAddition = managedPoliciesMissingRemotely.map(
      (mr) => attachPolicy(client, account, username, mr),
    );
    await Promise.all(managedPoliciesProcessAddition);

    const managedPoliciesProcessDeletion = managedPolicyMissingLocally.map(
      (ml) => detachPolicy(client, username, ml.PolicyArn),
    );
    await Promise.all(managedPoliciesProcessDeletion);
    console.log('[x] Managed Policies Updated');
  }

  if (
    missingLocally.length === 0 &&
    missingRemotely.length === 0 &&
    managedPolicyMissingLocally.length === 0 &&
    managedPoliciesMissingRemotely.length === 0
  ) {
    console.log(`\nIAM User '${username}' is Synced`);
  }
}

async function updateUsers(client, account, users, apply) {
  const processing = users.map((user) =>
    updateUser(client, account, user.username, user, apply),
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
