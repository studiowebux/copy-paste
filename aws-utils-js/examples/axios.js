const getParameter = require("@yetanothertool/ssm");
const AWSXRay = require("aws-xray-sdk");
AWSXRay.captureHTTPsGlobal(require("https"));

const AxiosWithXray = require("axios").default;

const doSomething = async (auth, payload) => {
  AWSXRay.capturePromise();
  return AxiosWithXray.post(
    `https://yetanothertool.com`,
    { foo: "bar" },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

async function indexDocument(payload) {
  const creds = await (
    await getParameter({
      Name: process.env.MY_CREDENTIAL_KEY,
      WithDecryption: true,
    })
  ).Parameter.Value;

  try {
    await doSomething(creds, payload);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateSomething(payload) {
  console.log("Put Document");

  await indexDocument(payload);
}

module.exports = {
  updateSomething,
};
