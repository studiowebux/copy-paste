// Studio Webux S.E.N.C @ 2022

const {
  AddUserToGroupCommand,
  RemoveUserFromGroupCommand,
  ListGroupsForUserCommand,
} = require('@aws-sdk/client-iam');

async function detachGroup(client, username, group) {
  return client.send(
    new RemoveUserFromGroupCommand({
      UserName: username,
      GroupName: group,
    }),
  );
}
async function addToGroup(client, username, group) {
  return client.send(
    new AddUserToGroupCommand({ UserName: username, GroupName: group }),
  );
}

async function removeFromGroup(client, username, group) {
  return client.send(
    new RemoveUserFromGroupCommand({ UserName: username, GroupName: group }),
  );
}

async function detachGroups(client, username) {
  const groups = await client.send(
    new ListGroupsForUserCommand({ UserName: username }),
  );

  const processing = groups.Groups.map((g) =>
    detachGroup(client, username, g.GroupName),
  );
  await Promise.all(processing);
}

module.exports = {
  removeFromGroup,
  addToGroup,
  detachGroup,
  detachGroups,
};
