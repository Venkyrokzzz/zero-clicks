---
name: deploy
description: Build, check, commit and deploy to Vercel production
---

Deploy Zero Clicks to production:

1. Run `npm run build` — if it fails, stop and fix errors first
2. Run `npm run lint` — fix any warnings
3. Run `git status` to see what's changed
4. Run `git diff` to review changes
5. Stage the changed files: `git add [list the specific files]`
6. Commit with a descriptive message following: "feat/fix/content/style: description"
7. Push: `git push origin main`
8. Check deployment at https://vercel.com/hemavenkateshwork7-1630s-projects/zero-clicks/deployments
9. Verify live at https://zeroclicks.vercel.app

Report back with: what changed, commit hash, and deployment status.
