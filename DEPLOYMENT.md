# Publish OSMO Creation

Requested GitHub destination: **Jaykay73/osmo-creation**, public.
Requested Vercel account: the user's account linked to GitHub. Requested project
name: `osmoportfolio`, for `https://osmoportfolio.vercel.app` if available.
Domain availability has not been confirmed. No remote repository or live
deployment has been created by the preparation steps.

## Create the initial history

This agent environment permits reading `.git` but blocks writes inside it.
Run the following in your own terminal from the project directory:

```powershell
node scripts/create-history.mjs --plan
node scripts/create-history.mjs
```

The script makes 20 feature-based initial import commits. It uses your existing
Git author identity, stages explicit paths, excludes local settings and credentials,
and refuses to rewrite unrelated history or include pre-staged changes. If stopped
between commits, it can resume its matching history. It does not push anything.

## Publish to GitHub

The saved GitHub CLI login needs to be renewed:

```powershell
gh auth login --hostname github.com --web
gh auth status
gh repo create Jaykay73/osmo-creation --public --source . --remote origin --push
```

If that repository already exists, inspect it before adding a remote or pushing.
Do not force-push or replace an existing repository's history.

## Deploy to Vercel

Connect Vercel and import `Jaykay73/osmo-creation` under the account linked to GitHub.
Request the project name `osmoportfolio`; verify availability with Vercel before
claiming the address. If unavailable, ask for an alternative name.
Use the Next.js preset, repository root, and production branch `main`.
`vercel.json` declares `npm ci` and `npm run build`. Importing the repository
connects future pushes to Vercel deployments.

Leave `NEXT_PUBLIC_SITE_URL` unset until a custom domain is confirmed. The app
uses Vercel's production URL for canonical links and sitemap entries, with its
deployment URL as fallback. Do not copy the localhost value from `.env.example`
into Vercel's production environment.
See [Vercel's system environment variable reference](https://vercel.com/docs/environment-variables/system-environment-variables).

Optional email delivery requires `RESEND_API_KEY`, a verified
`ENQUIRY_FROM_EMAIL`, and optionally `ENQUIRY_TO_EMAIL`. Enter secrets directly
in Vercel's environment settings; do not commit them or paste them into chat.
Without these, the contact form preserves enquiries in its direct-email fallback.

After deployment, check the homepage gallery, a project photograph viewer,
`/contact?type=Wedding%20or%20engagement`, `/sitemap.xml`, and `/robots.txt`.
The existing silent motion studies should remain labeled as studies until actual
films are supplied.
