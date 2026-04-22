// Environment Configuration for Smart Chat Assistant
// This file contains all environment variables and configuration

const config = {
  // AI Services Configuration
  ai: {
    service: process.env.AI_SERVICE || 'GEMINI',
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
      maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 1000
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
    },
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY || 'your-hf-api-key',
      model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium'
    }
  },

  // YouTube API Configuration
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || 'your-youtube-api-key',
    maxResults: parseInt(process.env.YOUTUBE_MAX_RESULTS) || 3,
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/alsharq_academia',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'alsharq_academia',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    corsCredentials: process.env.CORS_CREDENTIALS === 'true'
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Chat Configuration
  chat: {
    historyLimit: parseInt(process.env.CHAT_HISTORY_LIMIT) || 50,
    sessionTimeout: parseInt(process.env.CHAT_SESSION_TIMEOUT) || 3600000,
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000
  },

  // Video Recommendations Configuration
  video: {
    cacheTtl: parseInt(process.env.VIDEO_CACHE_TTL) || 3600000,
    maxAgeDays: parseInt(process.env.VIDEO_MAX_AGE_DAYS) || 30
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 365
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Monitoring Configuration
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 300000
  }
};

// Validation function
const validateConfig = () => {
  const requiredVars = [
    'GEMINI_API_KEY',
    'YOUTUBE_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using default values. Some features may not work correctly.');
  }

  return true;
};

// Export configuration
module.exports = {
  config,
  validateConfig
};
