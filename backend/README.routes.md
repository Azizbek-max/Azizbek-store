# Backend API Routes (Summary)

- POST /api/auth/register — register new user
- POST /api/auth/login — login (returns JWT)
- GET /api/posts — list posts (query: q, category)
- GET /api/posts/:slug — get post by slug
- POST /api/posts — (admin) create post (multipart/form-data), field `image` for upload
- PUT /api/posts/:id — (admin) update post
- DELETE /api/posts/:id — (admin) delete post
- GET /api/comments/post/:postId — list comments for post
- POST /api/comments — add comment (authenticated user)
- POST /api/newsletter/subscribe — subscribe email
- POST /api/recaptcha/verify — verify recaptcha token with Google
- GET /sitemap.xml — sitemap
- GET /robots.txt — robots
