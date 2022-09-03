<div align="center">

![Project Logo](https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg)

<h2>Copy .. Paste ..</h2>

<p align="center">
  <a href="https://github.com/yet-another-tool/copy-paste/issues">Report Bug</a>
  ·
  <a href="https://github.com/yet-another-tool/copy-paste/issues">Request Feature</a>
</p>
</div>

---

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About

<div>
<b> | </b>
<a href="https://www.buymeacoffee.com/studiowebux" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 30px !important; width: 105px !important"
/></a>
<b> | </b>
<a href="https://webuxlab.com" target="_blank"
      ><img
        src="https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg"
        alt="Webux Logo"
        style="height: 30px !important"
/> Webux Lab</a>
<b> | </b>
</div>

---

Collection of tools and scripts to configure, provision, create and more.

- [Ansible Vault Templates](ansible-vault/) - <a href="https://badge.fury.io/js/@yetanothertool%2Fvault"><img src="https://badge.fury.io/js/@yetanothertool%2Fvault.svg" alt="npm version" height="18"></a>
  - `yat-vault {create|generate|generate-string}`
- [Directory Parser](directory-parser/) - <a href="https://badge.fury.io/js/@yetanothertool%2Fdirectory-scanner"><img src="https://badge.fury.io/js/@yetanothertool%2Fdirectory-scanner.svg" alt="npm version" height="18"></a>
  - `yat-dir-scanner`
- [AWS Scripts](scripts/aws)
  - `acm`
  - `mfa`
  - `organization`
  - `ssm_ansible`
  - `sts`
  - `alias`
  - `fetch-info-from-organization`
  - `list-profile`
- [Git Scripts](scripts/git)
  - `tagger`
  - `deployment`
- [Godaddy Scripts](scripts/godaddy)
  - `update-ns`
- [Raspberrypi Scripts](scripts/raspberrypi)
- [SIAMM](siamm/) - <a href="https://badge.fury.io/js/@yetanothertool%2Fsiamm"><img src="https://badge.fury.io/js/@yetanothertool%2Fsiamm.svg" alt="npm version" height="18"></a>
  - `yat-siamm {template|update|create|cleanup|accountId|assumeRole}`
- [Templates](templates/)
  - `project`
  - `readme`
  - `lambda`
  - `service`
- [Utils](utils/) - <a href="https://badge.fury.io/js/@yetanothertool%2Forg-formation-mermaidjs"><img src="https://badge.fury.io/js/@yetanothertool%2Forg-formation-mermaidjs.svg" alt="npm version" height="18"></a>
  - `org-formation-mermaidjs`

## Contributing

1. Create a Feature Branch
2. Commit your changes
3. Push your changes
4. Create a PR

<details>
<summary>Working with your local branch</summary>

**Branch Checkout:**

```bash
git checkout -b <feature|fix|release|chore|hotfix>/prefix-name
```

> Your branch name must starts with [feature|fix|release|chore|hotfix] and use a / before the name;
> Use hyphens as separator;
> The prefix correspond to your Kanban tool id (e.g. abc-123)

**Keep your branch synced:**

```bash
git fetch origin
git rebase origin/master
```

**Commit your changes:**

```bash
git add .
git commit -m "<feat|ci|test|docs|build|chore|style|refactor|perf|BREAKING CHANGE>: commit message"
```

> Follow this convention commitlint for your commit message structure

**Push your changes:**

```bash
git push origin <feature|fix|release|chore|hotfix>/prefix-name
```

**Examples:**

```bash
git checkout -b release/v1.15.5
git checkout -b feature/abc-123-something-awesome
git checkout -b hotfix/abc-432-something-bad-to-fix
```

```bash
git commit -m "docs: added awesome documentation"
git commit -m "feat: added new feature"
git commit -m "test: added tests"
```

</details>

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

- Tommy Gingras @ tommy@studiowebux.com
