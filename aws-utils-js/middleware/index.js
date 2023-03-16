module.exports = (event) => {
  if (process.env.IS_OFFLINE == true) {
    // eslint-disable-next-line no-param-reassign
    event.requestContext.authorizer.claims = {
      sub: process.env.LOCAL_SUB,
      email_verified: 'true',
      iss: process.env.LOCAL_ISS,
      'cognito:username': process.env.LOCAL_SUB,
      'custom:organization': process.env.LOCAL_SUB,
      'custom:stripeCustomerId': process.env.LOCAL_STRIPE,
      origin_jti: '4ba59576-f34d-42fd-af53-a4eabfdd60b4',
      aud: '7ohi7c6o821t72lfu2kjbrttmi',
      event_id: '43a67129-0fd2-4d42-a3d9-7c7e4b4a183a',
      token_use: 'id',
      auth_time: '1649209912',
      name: process.env.LOCAL_NAME,
      exp: 'Sun Apr 10 09:18:30 UTC 2022',
      iat: 'Sun Apr 10 08:18:30 UTC 2022',
      jti: 'f215bc03-7a59-48bb-8319-8452efb41dbe',
      email: process.env.LOCAL_EMAIL,
    };
  }

  return event;
};
