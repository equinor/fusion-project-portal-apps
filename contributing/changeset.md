# Changeset

this repo uses [changeset](https://github.com/changesets/changesets) for versioning and keeping change logs up to date.

## Creating changeset

All PR should have a changeset if it changes code in any of the Fusion Framework packages. Changeset can be done from the PR UI or manually.

> as a reviewer it is important to make __SURE__ these changelogs are in place before approving the PR!

### Creating changeset from scratch

add `UNIQUE_ID.md`
```md
---
'@equinor/fusion-portal-PORTAL_NAME': patch
'@equinor/fusion-widget-WIDGET_NAME': minor
---

WHAT the change is
WHY the change was made
HOW to consume and/or migrate
```

### Creating from shell

```sh
pnpm changeset
```

### From Bot

when creating a PR to our repo, a [changeset bot](https://github.com/apps/changeset-bot) will run on the PR. Changesets can be created directly from the UI