# Backend - Amazon Affiliate

This backend uses Node.js, Express and MongoDB (Mongoose).

Quick start

1. Copy `.env.example` to `.env` and set values (MONGO_URI, JWT_SECRET, Cloudinary keys, ADMIN_EMAIL, ADMIN_PASSWORD).
2. Install deps:
   npm install
3. Seed admin user (optional):
   npm run seed
4. Seed sample posts (optional):
   npm run seed:samples
4. Start server (dev):
   npm run dev

API endpoints

- POST /api/auth/register - register user (used for regular users)
- POST /api/auth/login - login and receive JWT
- GET /api/posts - list posts (query: q, category)
- GET /api/posts/:slug - product detail
- POST /api/posts - admin-only create (multipart/form-data, field `image` for upload)
- PUT /api/posts/:id - admin-only update
- DELETE /api/posts/:id - admin-only delete

Notes

- Image uploads are stored on Cloudinary when `CLOUDINARY_*` values are configured. The `Post` model stores `imagePublicId` so you can use Cloudinary transformations (e.g., `https://res.cloudinary.com/<cloud_name>/image/upload/w_1200,q_auto,f_auto/<public_id>`) for responsive & optimized images.
- Admin seeding uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars or defaults.

Security & Hardening

- Requests are sanitized using `express-mongo-sanitize` and `xss-clean` to reduce injection/XSS risk.
- Helmet is enabled for secure headers.
- Rate limiting is applied globally and per-route for sensitive endpoints (auth, newsletter, comments).
- reCAPTCHA verification is supported. To enforce reCAPTCHA checks on registration/newsletter subscribe, set `RECAPTCHA_SECRET` in `.env` and pass `recaptchaToken` from the client.
- CORS is limited to origins in `CLIENT_URL` (comma-separated).

Performance & caching

- Gzip/deflate compression enabled using `compression` middleware for API responses.
- GET endpoints for posts and post details include `Cache-Control: public, max-age=600` (10 minutes) to reduce backend load.
- For best image performance use Cloudinary transformations (resize, `f_auto`, `q_auto`) and use the `imagePublicId` returned from uploads.
- Consider enabling CDN caching on your hosting provider and using a reverse proxy with caching for production.


Deployment

- Recommended hosts: Render or Railway. Steps:
  1. Create a new service and set `MONGO_URI` to your MongoDB Atlas URI.
  2. Add environment variables: `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_URL` (your frontend URL). Optionally set `RECAPTCHA_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
  3. Set the start command to `npm start`.
  4. After deployment, run `npm run seed` (or run the seed script once) to create the admin user.

Notes: Ensure HTTPS is enabled for your backend and that `CLIENT_URL` uses the frontend production URL.


