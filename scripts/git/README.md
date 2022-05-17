<div align="center">

![Project Logo](https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg)

<h2>Git Scripts</h2>

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
      <ul>
        <li><a href="#technologies">Technologies</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#sources">Sources</a></li>
  </ol>
</details>

---

## About

A bunch of scripts to facilitate git actions within pipelines.

### Technologies

This section covers the tools and packages used for the project,

- bash
- git
- curl
- github tags
- github deployment

## Usage

Look into the `tests/test.sh` to have a better idea about how to use these scripts.

---

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

## Sources

- https://github.com/alessandrobologna/aws-codebuild-git/blob/master/git-tagger
- https://github.com/aws-samples/eks-workshop/blob/main/buildspec.yml.disabled
- https://stackoverflow.com/a/42449998
- https://devconnected.com/how-to-delete-local-and-remote-tags-on-git/
- https://stackoverflow.com/a/28280404
- https://unix.stackexchange.com/questions/69314/automated-ssh-keygen-without-passphrase-how
- https://docs.github.com/en/rest/reference/deployments

