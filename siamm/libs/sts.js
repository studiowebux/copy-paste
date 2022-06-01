// Studio Webux S.E.N.C @ 2022

const {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand,
} = require('@aws-sdk/client-sts');

const { IAMClient } = require('@aws-sdk/client-iam');

async function getIdentity(client) {
  const id = await client.send(new GetCallerIdentityCommand());
  console.log(`|\t${id.UserId}\t|\t${id.Account}\t|\t${id.Arn}\t|`);
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
