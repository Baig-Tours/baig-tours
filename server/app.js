const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

// ── Core middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.' });
});

// ── Route mounts ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', packageRoutes);

// ── 404 + centralized error handling (must be registered LAST) ──
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;