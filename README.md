# Amazon Affiliate Site (React + Node.js/Express + MongoDB)

Professional Amazon Affiliate website starter built with:
- Frontend: React (Vite) + Tailwind CSS + react-i18next + react-helmet-async
- Backend: Node.js + Express + MongoDB (Mongoose) + Cloudinary for image hosting

Structure
- `frontend/` — React client (Vite)
- `backend/` — Express API

Features (implemented)
- Admin (single admin user seeded or created via env) with JWT authentication
- Admin CRUD for posts: title, description, categories, image upload (Cloudinary), required affiliate link (admin pastes their own affiliate URL)
- Client: product list with search & category filter, product detail page, "View on Amazon" button opens affiliate link in a new tab
- User auth (register/login), comments with star ratings, newsletter subscribe
- SEO: per-page meta tags, `sitemap.xml`, `robots.txt`
- Security: Helmet, input sanitization, XSS protection, rate limiting, optional reCAPTCHA verification
- i18n: English & Uzbek with language switcher
- Google Analytics (optional) integration

Important restrictions
- No Amazon API or scraping
- No ASIN fields
- Affiliate links are added manually by the admin (e.g., `https://amzn.to/xxxx`)

Getting started (local development)

1. Clone repo
2. Backend setup
   - cd backend
   - copy `.env.example` to `.env` and fill values: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL` (e.g., `http://localhost:3000`), optionally `RECAPTCHA_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - npm install
   - npm run seed (create the admin user)
   - npm run dev

3. Frontend setup
   - cd frontend
   - copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000/api` (and optionally `VITE_GA_MEASUREMENT_ID` for analytics)
   - npm install
   - npm run dev

Admin usage
- Login: go to `/admin/login` and enter the seeded admin credentials (from `.env` or the seed script output)
- Create a post: provide title, description, (comma-separated) categories, upload image, and paste your pre-made Amazon affiliate link in the Affiliate Link field. Save.

Deployment
- Frontend: Recommended Vercel. Add environment variable `VITE_API_URL` pointing to the deployed backend and (optionally) `VITE_GA_MEASUREMENT_ID`.
- Backend: Recommended Render (example `render.yaml` included) or Railway. Set env vars in the service settings (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`, etc.). Run the `npm run seed` script once to create the admin user.

Quick deploy steps are available in `DEPLOY.md` and a sample `render.yaml` has been added to help automate Render service creation.

Security & compliance notes
- Ensure HTTPS in production
- No automated affiliate link generation — admin must manage links manually

What's left / optional
- Image optimization pipeline (e.g., Cloudinary transformations)
- End-to-end tests, accessibility audits, and performance tuning
- Mailchimp integration for newsletters (optional)

See `backend/README.md` and `frontend/README.md` for more details and commands.

