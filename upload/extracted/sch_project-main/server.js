// Main Server File for Smart Chat Assistant API
// This file sets up the Express server with all necessary middleware and routes

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { config, validateConfig } = require('./config/environment');

// Import routes
const chatRoutes = require('./api/chat');

// Initialize Express app
const app = express();

// Validate configuration
validateConfig();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://generativelanguage.googleapis.com"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: config.server.corsCredentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    error: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.',
    retryAfter: Math.ceil(config.security.rateLimitWindowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'أهلاً بك في API المساعد الذكي لأكاديمية الشرق',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      chatHistory: '/api/chat/history/:studentId',
      analytics: '/api/chat/analytics/:studentId',
      recommendations: '/api/chat/recommendations/:studentId'
    },
    documentation: '/docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'الصفحة غير موجودة',
    message: 'يرجى التحقق من المسار المطلوب',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/chat',
      'GET /api/chat/history/:studentId',
      'GET /api/chat/analytics/:studentId',
      'GET /api/chat/recommendations/:studentId'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  // Don't leak error details in production
  const isDevelopment = config.server.env === 'development';
  
  res.status(err.status || 500).json({
    error: 'حدث خطأ في الخادم',
    message: isDevelopment ? err.message : 'يرجى المحاولة لاحقاً',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
const PORT = config.server.port;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Smart Chat Assistant API is running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${config.server.env}`);
  console.log(`🤖 AI Service: ${config.ai.service}`);
  console.log(`📺 YouTube API: ${config.youtube.apiKey ? 'Configured' : 'Not configured'}`);
  console.log(`🔒 Security: Rate limiting enabled`);
  console.log(`📝 Logging: ${config.logging.level}`);
});

module.exports = app;
