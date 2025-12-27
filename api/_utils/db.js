const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) console.warn('MONGODB_URI not set — local dev may fail');

let client;
let db;

async function connect() {
  if (db) return db;
  if (!client) client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'amazon_affiliate');
  return db;
}

module.exports = { connect };
