// Studio Webux S.E.N.C @ 2022

const {
  AttachUserPolicyCommand,
  DetachUserPolicyCommand,
  ListAttachedUserPoliciesCommand,
} = require('@aws-sdk/client-iam');

async function attachPolicy(client, account, username, policyArn) {
  return client.send(
    new AttachUserPolicyCommand({
      UserName: username,
      PolicyArn: `arn:aws:iam::${account}:policy/${policyArn}`,
    }),
  );
}

async function detachPolicy(client, username, policyArn) {
  return client.send(
    new DetachUserPolicyCommand({
      UserName: username,
      PolicyArn: policyArn,
    }),
  );
}

async function detachPolicies(client, username) {
  const managedPolicies = await client.send(
    new ListAttachedUserPoliciesCommand({ UserName: username }),
  );

  const processing = managedPolicies.AttachedPolicies.map((ap) =>
    detachPolicy(client, username, ap.PolicyArn),
  );
  await Promise.all(processing);
}

module.exports = {
  attachPolicy,
  detachPolicy,
  detachPolicies,
};
