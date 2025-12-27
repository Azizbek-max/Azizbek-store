# Frontend - Amazon Affiliate

Tech: React (Vite) + Tailwind CSS + i18n + react-helmet-async

Quick start

1. Copy `.env.example` to `.env` and set `VITE_API_URL` and (optionally) `VITE_GA_MEASUREMENT_ID`.
2. Install deps: `npm install`
3. Run: `npm run dev`

Features

- Product list with search & category filter
- Product detail page with affiliate "View on Amazon" button (opens in new tab)
- Admin login & dashboard (create/edit/delete posts, image upload)
- i18n (English & Uzbek) with language switcher
- SEO meta handling via `react-helmet-async`
- Google Analytics optional integration via `VITE_GA_MEASUREMENT_ID`

Deployment

- Recommended: deploy frontend on Vercel (follow Vercel docs and add `VITE_API_URL` and `VITE_GA_MEASUREMENT_ID` in Project Settings -> Environment Variables).

Testing & Accessibility

- Run unit tests: `npm run test` (Vitest + Testing Library). A11y tests use `axe-core` in `src/__tests__/a11y.test.jsx`.
- CI: a GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs frontend tests on push and PRs.

Screenshots

- Add screenshots to `screenshots/` (e.g., `screenshots/home.png`, `screenshots/admin.png`) to document UI for the README. See `screenshots/README.md` for suggested shots.
