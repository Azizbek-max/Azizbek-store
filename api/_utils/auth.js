const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_jwt_secret';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

function sign(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

function verify(token){
  try{ return jwt.verify(token, JWT_SECRET); } catch(e){ return null; }
}

function getTokenFromReq(req){
  const hdr = req.headers && req.headers.cookie;
  if (!hdr) return null;
  const c = cookie.parse(hdr || '');
  return c[COOKIE_NAME] || null;
}

function setTokenCookie(res, token){
  const cookieStr = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60*60*24*30 // 30 days
  });
  res.setHeader('Set-Cookie', cookieStr);
}

function clearTokenCookie(res){
  const cookieStr = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  res.setHeader('Set-Cookie', cookieStr);
}

module.exports = { sign, verify, getTokenFromReq, setTokenCookie, clearTokenCookie };
