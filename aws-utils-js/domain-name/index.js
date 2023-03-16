function domainName(url) {
  if (!url) {
    throw new Error('No url provided');
  }
  // Extract the domain only
  let domain = url.split(/https?:\/\//)[1];
  if (domain) {
    domain = domain.split('/')[0];
  } else {
    domain = url.split('/')[0];
  }

  let baseDomain = url.split(/(https?:\/\/)/)[1];
  baseDomain += domain;

  return { domain, baseDomain };
}

module.exports = {
  domainName,
};
