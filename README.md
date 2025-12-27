# Amazon Affiliate Site (Admin + Client)

Simple project with:
- Express backend (JSON file DB) - `server.js` (data stored in `data.json`) 
- Admin panel at `/public/admin.html` (login required)
- Client frontend at `/Index.html` to show posts
- Image uploads stored in `uploads/`

Quick start:
1. Install: `npm install`
2. Start: `npm run dev` (requires `nodemon`) or `npm start`
3. Create initial admin: open `http://localhost:3000/public/admin.html` and use the "Create initial admin" button (only if no admin exists).
4. Login and create posts (id, title, description, link, image upload → choose file, click “Upload image”, then Create). IDs should be alphanumeric (letters, numbers, - or _), up to 50 chars.

Testing & verification:
- Create admin via admin UI.
- Login, create a post. Verify it appears on the client page `Index.html`.
- Test image upload: choose file -> Upload image -> preview should appear -> Create post -> image served from `/uploads/`.
- Test Edit: click Edit on a post to load it into the form, change fields, Update.
- Test Delete: Delete button shows confirmation and removes post.

Notes & improvements made:
- Replaced SQLite with a simple JSON store (`data.json`) to avoid native build dependencies on Windows.
- Added validation for post inputs (ID format, link must start with http/https).
- Added **category** support for posts (options: furniture, tech, uncategorized). Admin can set category when creating/updating a post.
- Implemented **search bar** and **category filter** on the client page. Search matches post ID or title and can be combined with category filtering.
- Implemented **full Vercel deployment path** (Variant B): serverless API functions using **MongoDB Atlas** and **Cloudinary** for uploads. See `api/` folder and `api/README.md` for required env vars and details.
- Improved admin UI: image preview, upload feedback, pagination in the post list, clearer messages.

---

## Vercel Deployment & Migrations

### Quick Vercel steps
1. Push code to GitHub (create repo and push).  
2. On Vercel: New Project → Import GitHub repo.  
3. In Vercel Project Settings → Environment Variables, add:
   - `MONGODB_URI`  
   - `MONGODB_DB` (optional)  
   - `JWT_SECRET`  
   - `CLOUDINARY_CLOUD_NAME`  
   - `CLOUDINARY_UPLOAD_PRESET`  
4. Deploy; Vercel will pick up `/api` functions and static files.

### Migrate local `data.json` to MongoDB
1. Set env vars locally: `MONGODB_URI` (and `MONGODB_DB` if you want a custom DB name).  
2. Run: `npm run migrate` — this will import `admins` and `posts` into MongoDB (skips duplicates).

If you want, I can prepare a short checklist and walk you through linking your GitHub repo to Vercel and setting env vars step-by-step.

Security notes:
- Change `SESSION_SECRET` env var in production.
- The one-time `/api/setup` is allowed only if there are no admins. Remove or secure it in production as needed.
- This is a simple example; harden for production (CSRF, rate limiting, stronger session cookies, input sanitization).
