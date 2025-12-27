API serverless functions for Vercel

Environment variables required for Variant B (Vercel):
- MONGODB_URI: MongoDB Atlas connection string (include username/password)
- MONGODB_DB: (optional) database name, default 'amazon_affiliate'
- JWT_SECRET: secret for signing admin tokens
- CLOUDINARY_CLOUD_NAME: your Cloudinary cloud name
- CLOUDINARY_UPLOAD_PRESET: an unsigned upload preset name configured in Cloudinary

Notes:
- The admin UI uploads images directly to Cloudinary using the unsigned preset.
- Admin authentication uses a JWT stored in a cookie (httpOnly).
