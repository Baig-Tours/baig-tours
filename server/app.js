const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

// ── Core middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // required so the browser sends/receives the httpOnly cookie
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
// Every module mounts its router here, one line each, e.g.:
//   app.use('/api/packages', packageRoutes);
//   app.use('/api/admin/packages', adminPackageRoutes);
// Dev 1 owns this file for the platform-core wiring below; other devs'
// mount lines are added via PR against this section as their modules land.
app.use('/api/auth', authRoutes);

// ── 404 + centralized error handling (must be registered LAST) ──
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
