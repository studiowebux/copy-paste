// Studio Webux S.E.N.C @ 2022

const {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand,
} = require('@aws-sdk/client-sts');

const { IAMClient } = require('@aws-sdk/client-iam');

async function getIdentity(client) {
  const id = await client.send(new GetCallerIdentityCommand());
  console.table({
    UserId: id.UserId,
    AccountId: id.Account,
    UserArn: id.Arn,
  });
  return id.Account;
}

async function assumeRole(
  client,
  accountId,
  targetRole = 'OrganizationAccountAccessRole',
) {
  const role = `arn:aws:iam::${accountId}:role/${targetRole}`;
  const creds = await client.send(
    new AssumeRoleCommand({ RoleArn: role, RoleSessionName: 'siamm' }),
  );

  const iam = new IAMClient({
    credentials: {
      accessKeyId: creds.Credentials.AccessKeyId,
      secretAccessKey: creds.Credentials.SecretAccessKey,
      sessionToken: creds.Credentials.SessionToken,
      expiration: creds.Credentials.Expiration,
    },
  });

  const sts = new STSClient({
    credentials: {
      accessKeyId: creds.Credentials.AccessKeyId,
      secretAccessKey: creds.Credentials.SecretAccessKey,
      sessionToken: creds.Credentials.SessionToken,
      expiration: creds.Credentials.Expiration,
    },
  });

  return { sts, iam };
}

module.exports = {
  getIdentity,
  assumeRole,
};
