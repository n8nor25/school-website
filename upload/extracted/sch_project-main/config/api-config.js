// API Configuration with OpenRouter
// تكوين API مع OpenRouter

const API_CONFIG = {
  // OpenRouter API Configuration
  OPENROUTER: {
    apiKey: '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',
    model: 'google/gemini-flash-1.5',
    baseUrl: 'https://openrouter.ai/api/v1',
    temperature: 0.7,
    maxTokens: 1000
  },
  
  // AI Service Selection
  AI_PROVIDER: 'OPENROUTER', // OPENROUTER, GEMINI, LOCAL
  
  // YouTube API (اختياري)
  YOUTUBE: {
    apiKey: 'your-youtube-api-key',
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  },
  
  // Server Configuration
  SERVER: {
    port: 3000,
    env: 'development'
  },
  
  // Security
  SECURITY: {
    jwtSecret: 'your-jwt-secret-key',
    encryptionKey: 'your-encryption-key'
  },
  
  // CORS
  CORS: {
    origin: 'http://localhost:3000',
    credentials: true
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    windowMs: 900000, // 15 minutes
    maxRequests: 100
  },
  
  // Chat Configuration
  CHAT: {
    historyLimit: 50,
    sessionTimeout: 3600000, // 1 hour
    maxMessageLength: 1000
  }
};

// دالة للتحقق من صحة API Keys
const validateAPIKeys = () => {
  const provider = API_CONFIG.AI_PROVIDER;
  
  if (provider === 'LOCAL') {
    return { valid: true, message: 'Using local chat API' };
  }
  
  const requiredKey = API_CONFIG[provider]?.apiKey;
  
  if (!requiredKey || requiredKey.includes('your-')) {
    return { 
      valid: false, 
      message: `Please set ${provider}_API_KEY` 
    };
  }
  
  return { valid: true, message: `${provider} API key is configured` };
};

// دالة للحصول على إعدادات API
const getAPIConfig = (provider = API_CONFIG.AI_PROVIDER) => {
  return {
    ...API_CONFIG[provider],
    provider: provider
  };
};

export { API_CONFIG, validateAPIKeys, getAPIConfig };
export default { API_CONFIG, validateAPIKeys, getAPIConfig };
