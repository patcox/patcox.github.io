# Agent notes for patcox.net

Instructions for any agent (Claude Code or otherwise) working in this repo.
If you discover something new while working here that a future agent would
want to know, add it to this file.

## /now page

Whenever you edit `src/content/pages/now.md`, update the `lastUpdated` field
in its frontmatter to the current date (format: `"Month D, YYYY"`, e.g.
`"July 2, 2026"`). This is a manual /now page — the date is the only signal
readers have that it's current, so don't leave it stale after a content edit.

## Images

Don't drop image files straight into `public/`. Put them in `src/assets/`
and reference them with Astro's `<Image>` component from `astro:assets`
(see `src/layouts/Base.astro` and `src/pages/index.astro` for examples).
This gets them resized/compressed/content-hashed at build time, which
matters a lot for perf — the header headshot went from a 445KB PNG served
raw on every navigation to a ~1KB hashed webp.

## Site config

`src/config/site.ts` has `showNow` / `showWriting` / `showNewsletter` flags
that gate whole pages/sections. Check these before assuming a page is live
in production — `showWriting` is currently `false`, so `/writing` and the
homepage "Recent writing" section don't render even though the code exists.

## CSS gotcha: `.section-label`

`.page-header p` (used on Connect/Now/Writing) has higher specificity than
the bare `.section-label` class, so `.page-header .section-label` carries
an explicit color override to win the cascade. If you touch either rule,
check both — it's easy to change the base class and have it silently
overridden in the page-header context.

## Screenshots / verification

Playwright isn't a project dependency. To visually verify a change:
```
npm install -D playwright
npm run dev -- --port 4321   # run in background
node your-screenshot-script.cjs   # launch with executablePath: '/opt/pw-browsers/chromium'
```
Then clean up afterward — kill the dev server, delete the script, and
`git checkout -- package.json package-lock.json` to drop the temporary
playwright dependency before committing.

## Pull requests

This repo squash-merges PRs, so the PR description becomes the permanent
commit message on `main` — it's the record, not the last commit's message.
**Every time you push additional commits to an already-open PR's branch,
update the PR title/body (`update_pull_request`) before ending your turn**
so it describes the full current diff, not just what was true when the PR
was first opened.
