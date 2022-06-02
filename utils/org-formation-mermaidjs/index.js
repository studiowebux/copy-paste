#!/usr/bin/env node

// Studio Webux S.E.N.C @ 2022

const yaml = require("js-yaml");
const fs = require("fs");
const { CLOUDFORMATION_SCHEMA } = require("js-yaml-cloudformation-schema");
const {
  createGraph,
  createOU,
  createAccount,
  linkOUs,
  lookForParent,
  generateMermaid,
  sanitize,
} = require("./libs");

const args = process.argv.slice(2);
const directory = args[0];

// Load the file
const doc = yaml.load(fs.readFileSync(directory, "utf8"), {
  schema: CLOUDFORMATION_SCHEMA,
});

// Load Resources
const ManagementAccount = Object.entries(doc.Organization).filter(
  (org) => org[1].Type === "OC::ORG::MasterAccount"
);
const OUs = Object.entries(doc.Organization).filter(
  (org) => org[1].Type === "OC::ORG::OrganizationalUnit"
);
const Accounts = Object.entries(doc.Organization).filter(
  (org) => org[1].Type === "OC::ORG::Account"
);

// Initialize graph
const graph = createGraph({
  name: sanitize(ManagementAccount[0][0]),
  description: ManagementAccount[0][1].Properties.AccountName,
});

// Get All AWS Accounts
const generatedAccounts = new Set();
generatedAccounts.add(
  createAccount({
    id: sanitize(ManagementAccount[0][0]),
    name: sanitize(ManagementAccount[0][1].Properties.AccountId),
    accountId: sanitize(ManagementAccount[0][1].Properties.AccountId),
    description: ManagementAccount[0][1].Properties.AccountName,
  })
);
Accounts.forEach((account) => {
  const obj = createAccount({
    id: sanitize(account[0]),
    name: account[1].Properties.AccountName,
    accountId: account[1].Properties.AccountId,
    description: account[1].Properties.Alias,
  });
  generatedAccounts.add(obj);
});

// Get all OUs
let generatedOUs = [];
OUs.forEach((ou) => {
  generatedOUs.push(
    createOU({
      id: sanitize(ou[0]),
      name: ou[1].Properties.OrganizationalUnitName,
      description: "",
      accounts: ou[1].Properties.Accounts?.map(
        (account) =>
          [...generatedAccounts].filter((ga) => ga.id === account.Ref)[0]
      ),
    })
  );
});

// Link OUs to OUs
OUs.forEach((ou) => {
  const idx = generatedOUs.findIndex((go) => go.id === ou[0]);
  generatedOUs[idx].OU = ou[1].Properties.OrganizationalUnits?.map(
    (unit) => generatedOUs.filter((gous) => gous.id === unit.Ref)[0]
  );
});

// Cleanup everything
generatedOUs = [
  ...generatedOUs.filter(
    (checkForParent) => !lookForParent(checkForParent.id, generatedOUs)
  ),
];

// Add all valid OUs to the root
linkOUs({
  OU: graph.root,
  OUs: [...generatedOUs],
});

const mermaid = generateMermaid(graph);
console.log(mermaid);
