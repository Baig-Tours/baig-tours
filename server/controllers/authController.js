const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Admin login. Verifies credentials, sets an httpOnly JWT cookie,
 *          and returns the admin's public profile. Matches blueprint §8.2:
 *          1. Find user by email (password explicitly selected)
 *          2. bcrypt.compare candidate vs stored hash
 *          3. On match: generateToken sets cookie, update lastLogin
 *          4. On mismatch: 401 with a generic "Invalid email or password"
 *             (never reveal whether the email or the password was wrong)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return apiResponse(res, false, 'Invalid email or password.', null, [], 401);
  }

  if (!user.isActive) {
    return apiResponse(res, false, 'This account has been disabled.', null, [], 403);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return apiResponse(res, false, 'Invalid email or password.', null, [], 401);
  }

  generateToken(res, user);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return apiResponse(res, true, 'Logged in successfully.', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private (any authenticated admin)
 * @desc    Clears the auth cookie. Cookie options here (path, sameSite,
 *          secure) must mirror generateToken's options exactly, or some
 *          browsers will silently fail to clear the cookie.
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return apiResponse(res, true, 'Logged out successfully.');
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 * @desc    Returns the currently authenticated admin's profile.
 *          Used by the frontend AuthContext on app load to restore
 *          session state and by ProtectedRoute to decide whether to
 *          render an admin page or redirect to /admin/login.
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is already attached (and password-stripped) by verifyToken
  return apiResponse(res, true, 'Session is valid.', {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = { login, logout, getMe };
