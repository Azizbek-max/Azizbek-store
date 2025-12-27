// Utility to verify reCAPTCHA token with Google. Returns boolean.
async function verifyToken(token) {
  if (!process.env.RECAPTCHA_SECRET) return true; // if not configured, skip verification (config recommended)
  if (!token) return false;
  try {
    const resp = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`
    });
    const data = await resp.json();
    // Accept success=true and score >= 0.5 (if v3). For v2, success is sufficient.
    if (data.success && (data.score === undefined || data.score >= 0.5)) return true;
    return false;
  } catch (err) {
    console.error('reCAPTCHA verify error', err);
    return false;
  }
}

module.exports = { verifyToken };
