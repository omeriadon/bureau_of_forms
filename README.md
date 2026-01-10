# Bureau of Forms — intentionally hostile, coherent bureaucratic UI

This repository contains a small Next.js app that intentionally frustrates and delights by emulating a "broken" government service. All behaviors are reversible and opt-outtable; see the **Safety & opt-out** section below.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Safety & opt-out

- Add `?sane=1` to the URL to disable corrupting behaviors and audio (recommended for reviewers).
- Press `Shift+Escape` to reset the UI and opt out of active attacks.
- All corruption is local to your browser (`localStorage`) and reversible; there is no data exfiltration or malicious device activity.

What is a "seed"?

- The site uses pseudo-randomness to generate themes, border radii, and some timed corruptions. If you provide a `?seed=12345` query param the same sequence of random choices will be used so you can reproduce a single, particularly awful run for demonstration and testing. If you don't provide a seed, a fresh random seed is created for each session.

## What this project implements

- Fleeing primary CTA that avoids the pointer until a key sequence is typed. ✅
- Theme randomizer with clashing palettes and jitter. ✅
- Probabilistic localStorage corruption (reversible via settings). ✅
- Modal cascades and phantom validations (UI-only). ✅
- Ambiguous server submit endpoint (`/api/submit`) that responds with plausible but unclear messages. ✅

## Development notes

- This app uses the Next.js app router and TypeScript. Add a `?seed=...` query parameter to reproduce a seeded run.

---

(Original Next.js README content follows below)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
