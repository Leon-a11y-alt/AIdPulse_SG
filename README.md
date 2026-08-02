# AidPulse SG

[![CI](https://github.com/Leon-a11y-alt/AIdPulse_SG/actions/workflows/ci.yml/badge.svg)](https://github.com/Leon-a11y-alt/AIdPulse_SG/actions/workflows/ci.yml)

**Live demo:** https://aidpulsesg.vercel.app

One app for real-time health & emergency response in Singapore — live case tracking, hospital bed availability, an AI health assistant, and volunteer & officer coordination.

---

## Quality pipeline

Every push and pull request runs the full pipeline in GitHub Actions — hygiene and
secret scanning, ESLint, strict `tsc`, 76 unit tests on Node 22 and 24 behind a
coverage gate, an `npm audit` gate, and a production build that is booted and
smoke-tested over HTTP. The pipeline verifies; it does not deploy — it publishes
the passing build as an artifact, a single `ci-result` check to gate on, and a
`/api/health` probe for whatever deploys it.

Run the same gates locally:

```bash
npm run ci        # lint → typecheck → tests + coverage → build
npm test          # just the unit tests
npm run test:watch
```

Requires Node 22.18+ or 24+ (the test suite runs TypeScript directly via Node's
native type stripping — no test framework, no transpile step).

Full write-up: [docs/05-ci-pipeline.md](docs/05-ci-pipeline.md).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
