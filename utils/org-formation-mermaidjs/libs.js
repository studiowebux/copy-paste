// Studio Webux S.E.N.C @ 2022

function createGraph({ name, description, icon, OU, services }) {
  return {
    root: {
      id: name,
      name,
      description,
      icon,
      services: services || [],
      OU: OU || [],
    },
  };
}

function createOU({ id, name, description, icon, OU, accounts }) {
  return {
    id,
    name,
    description,
    icon,
    OU: OU || [],
    accounts: accounts || [],
  };
}

function createAccount({ id, accountId, name, description, icon, services }) {
  return {
    id,
    accountId,
    name,
    description,
    icon,
    services: services || [],
  };
}

function sanitize(str) {
  if (!str) return "";
  return str.replace(/ /g, "_");
}

function linkOUs({ OUs, OU }) {
  OU.OU = [...OU.OU, ...OUs];
  return OU;
}

function lookForParent(find, allOUs) {
  return (
    allOUs
      .filter((ou) => ou.OU && ou.OU.length > 0)
      .filter((ou) => ou.OU.filter((o) => o.id === find).length > 0).length > 0
  );
}

function nestedOUs(parent, ou) {
  let mermaid = "";
  if (ou && ou.length > 0) {
    ou.forEach((o) => {
      mermaid += `${sanitize(parent)} --> ${sanitize(o.id)}{{${
        o.description || o.name
      }}}:::ou\n`;
      mermaid += nestedOUs(o.id, o.OU);
    });
  }

  return mermaid;
}

function nestedAccounts(ou) {
  let mermaid = "";
  if (ou && ou.length > 0) {
    ou.forEach((o) => {
      if (o.accounts && o.accounts.length > 0) {
        o.accounts.forEach((account) => {
          mermaid += `${sanitize(o.id)} --> ${sanitize(account.id)}(${
            account.description || account.name
          } - ${sanitize(account.accountId || "Not Provided")}):::account\n`;
        });
      }
      mermaid += nestedAccounts(o.OU);
    });
  }

  return mermaid;
}

function generateMermaid(graph) {
  const { root } = graph;

  let mermaid = `flowchart LR\n`;

  // Style
  mermaid += `classDef root fill:#b0084d,color:#fff\n`;
  mermaid += `classDef ou fill:#f54749,color:#fff\n`;
  mermaid += `classDef account fill:#945df2,color:#fff\n`;
  mermaid += `classDef scp fill:#5455f2,color:#fff\n`;

  // Documentation
  mermaid += `ManagementAccount([Management Account]):::root\n`;
  mermaid += `OU{{OU}}:::ou\n`;
  mermaid += `Account(Account):::account\n`;

  // Added root item
  mermaid += `${sanitize(root.id)}([${
    root.description || root.name
  }]):::root\n`;

  // Traverse all OUs
  mermaid += nestedOUs(root.id, root.OU);

  // Traverse all Accounts
  mermaid += nestedAccounts(root.OU);

  return mermaid;
}

module.exports = {
  createGraph,
  createOU,
  createAccount,
  linkOUs,
  lookForParent,
  generateMermaid,
  sanitize,
};
