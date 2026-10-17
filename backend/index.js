const dotenv = require('dotenv');
// Always load environment variables before importing configuration or database modules
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB, disconnectDB, isDbConnected } = require('./config/db');

const app = express();
const INITIAL_PORT = process.env.PORT || 6000;

// Enable CORS for frontend requests
app.use(cors());

// Parse JSON bodies with custom error handling
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Graceful JSON syntax error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Syntax Error in Request Body:', err.message);
    return res.status(400).json({ success: false, error: 'Invalid JSON format in request.' });
  }
  next();
});

// Import API modular routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const profileRoutes = require('./routes/profile');
const historyRoutes = require('./routes/history');
const questionsRoutes = require('./routes/questions');
const pyqRoutes = require('./routes/pyq');

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/pyq', pyqRoutes);

// Health check endpoint with real-time MongoDB status reporting
app.get('/api/health', (req, res) => {
  const mongoStatus = isDbConnected();
  const dbState = mongoose.connection ? mongoose.connection.readyState : 0;
  
  const stateLabels = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    message: 'PrepAI AI Interview Platform API Server is active.',
    database: {
      status: stateLabels[dbState] || 'unknown',
      connected: mongoStatus,
      host: mongoose.connection.host || 'local',
      name: mongoose.connection.name || 'prep_ai',
      readyState: dbState
    }
  });
});

// Disable caching for static frontend files
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found.' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('PrepAI Server API is running. Frontend build will load when ready.');
    }
  });
});

// Server launch with MongoDB initialization & port fallback
async function startServer(portToTry) {
  await connectDB();

  const server = app.listen(portToTry, () => {
    console.log(`🚀 PrepAI Server running on port ${portToTry}`);
    console.log(`👉 API Healthcheck: http://localhost:${portToTry}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is busy. Trying fallback port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server launch error:', err);
    }
  });

  // Graceful Process Termination Handlers
  const handleGracefulShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Closing HTTP server and MongoDB connection...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
}

startServer(INITIAL_PORT);
