const express = require('express');
const router = express.Router();

const { login, logout, getMe } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const validateMiddleware = require('../middleware/validateMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/login — Public
router.post('/login', loginValidator, validateMiddleware, login);

// POST /api/auth/logout — Private (must be logged in to log out)
router.post('/logout', verifyToken, logout);

// GET /api/auth/me — Private
router.get('/me', verifyToken, getMe);

module.exports = router;
