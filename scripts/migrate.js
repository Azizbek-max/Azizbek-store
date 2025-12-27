/**
 * scripts/migrate.js
 * Copy data from local data.json into MongoDB (admins + posts)
 * Usage: set MONGODB_URI and run `node scripts/migrate.js`
 */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function main(){
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  const dataPath = path.join(__dirname, '..', 'data.json');
  if (!fs.existsSync(dataPath)) { console.error('data.json not found'); process.exit(1); }
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const dbName = process.env.MONGODB_DB || 'amazon_affiliate';
  const db = client.db(dbName);

  if (Array.isArray(data.admins) && data.admins.length){
    console.log(`Importing ${data.admins.length} admins (skipping duplicates)...`);
    for (const a of data.admins){
      const exists = await db.collection('admins').findOne({ username: a.username });
      if (!exists) await db.collection('admins').insertOne({ username: a.username, password_hash: a.password_hash, created_at: Date.now() });
    }
  }
  if (Array.isArray(data.posts) && data.posts.length){
    console.log(`Importing ${data.posts.length} posts (skipping duplicates)...`);
    for (const p of data.posts){
      const exists = await db.collection('posts').findOne({ id: p.id });
      const doc = { id: p.id, title: p.title, description: p.description||'', image: p.image||'', link: p.link||'', category: p.category || 'uncategorized', created_at: p.created_at || Date.now() };
      if (!exists) await db.collection('posts').insertOne(doc);
    }
  }
  console.log('Migration completed.');
  await client.close();
}

main().catch(err=>{ console.error('Migration error', err); process.exit(1); });
