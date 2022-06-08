# Publishing

- [Checking for Changes](./Publishing.md#checking-for-changes)
- [Publishing to NPM](./Publishing.md#publishing-to-npm)
- [Lerna Commands](./Publishing.md#lerna-commands)

## Checking for Changes

The command bellow will

- detect any version changes and increment when needed
- skip any private packages
- push a commit to github
- tag the commit with the changed package versions

```
lerna version patch --no-private --yes
```

Run the following command to skip any git actions

```
lerna version patch --no-private --yes --no-push --no-git-tag-version
```

## Publishing to NPM

The command below will

- check for any changes since the last release and patch the versions
- push a git commit and add tags for each changed version
- publish any changes to NPM

```
lerna version patch --no-private --yes
lerna publish from-git --yes
```

If the above command fails halfway, use the following command to check for any version differences between NPM and only publish the missing packages.

```
lerna publish from-package --yes
```

## Lerna Commands

### Lerna Version

Source: [Lerna Version](https://github.com/lerna/lerna/blob/main/commands/version/README.md)

```
lerna version [major | minor | patch | premajor | preminor | prepatch | prerelease]
# uses the next semantic version(s) value and this skips `Select a new version for...` prompt
```

#### `--no-private`

By default, lerna version will include private packages when choosing versions, making commits, and tagging releases. Pass --no-private to disable this behavior.

#### `--yes`

When run with this flag, lerna version will skip all confirmation prompts. Useful in Continuous integration (CI) to automatically answer the publish confirmation prompt.

#### `--no-git-tag-version` and `--no-push`

By default, lerna version will commit changes to package.json files and tag the release. Pass `--no-git-tag-version` to disable the behavior.

By default, lerna version will push the committed and tagged changes to the configured git remote. Pass `--no-push` to disable this behavior.

### Lerna Publish

Source: [Lerna Publish](https://github.com/lerna/lerna/blob/main/commands/publish/README.md)

```
lerna publish              # publish packages that have changed since the last release
lerna publish from-git     # explicitly publish packages tagged in the current commit
lerna publish from-package # explicitly publish packages where the latest version is not present in the registry
```

#### bump `from-git`

In addition to the semver keywords supported by lerna version, lerna publish also supports the from-git keyword. This will identify packages tagged by lerna version and publish them to npm. This is useful in CI scenarios where you wish to manually increment versions, but have the package contents themselves consistently published by an automated process.

#### bump `from-package`

Similar to the `from-git` keyword except the list of packages to publish is determined by inspecting each package.json and determining if any package version is not present in the registry. Any versions not present in the registry will be published. This is useful when a previous lerna publish failed to publish all packages to the registry.
