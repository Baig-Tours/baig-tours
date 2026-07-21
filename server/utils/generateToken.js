const jwt = require('jsonwebtoken');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Signs a JWT for the given user and sets it as an httpOnly cookie
 * on the response. The payload only ever carries { id, role } —
 * never the password hash or any other sensitive field.
 *
 * @param {import('express').Response} res
 * @param {{ _id: string, role: string }} user
 */
const generateToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie(process.env.COOKIE_NAME || 'token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SEVEN_DAYS_MS,
  });

  return token;
};

module.exports = generateToken;
