require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[server] Baig Tours API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Fail loudly instead of hanging on unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[server] Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
