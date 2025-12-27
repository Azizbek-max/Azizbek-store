Deploy checklist — Vercel (frontend) + Render (backend)

1) Push code to GitHub
   - git add .
   - git commit -m "Prepare for deploy"
   - git push origin main

2) Frontend — Vercel
   - Log in to Vercel and import the repository
   - During import set:
     - Root directory: `frontend/`
     - Build command: `npm run build`
     - Output directory: `dist`
   - Set environment variable (in Vercel web UI):
     - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - Deploy and confirm the site is live at the Vercel URL

3) Backend — Render
   - Log in to Render and create a new service by connecting the GitHub repo
   - Choose the `affiliate-backend` service from `render.yaml` or create manually
     - Build command: `cd backend && npm install`
     - Start command: `cd backend && npm start`
   - Add environment variables in the Render dashboard:
     - `MONGO_URI` = Your MongoDB Atlas connection string
     - `JWT_SECRET` = secure random string
     - `CLIENT_URL` = your Vercel frontend URL (https://...)
     - `CLOUDINARY_*` if using Cloudinary
   - Deploy the service

4) Seed admin user (Render Console)
   - After backend is live, open Render Shell or use a quick curl run in the Console:
     - `node scripts/seedAdmin.js` or `npm run seed`
   - Note: you may set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in service env to choose credentials

5) QA & Verify
   - Visit frontend URL, go to `/admin/login` and log in with seeded admin
   - Test posting, image upload (Cloudinary), newsletter, comments, and sitemap

6) Optional: Set up custom domain & HTTPS (in Vercel and Render UI)

Notes
- Keep secrets out of the repository. Use Render and Vercel environment variable UIs.
- If you prefer Railway instead of Render, the process is similar: connect GitHub, set env vars, and deploy.
