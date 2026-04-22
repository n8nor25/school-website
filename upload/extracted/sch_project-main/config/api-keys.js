// API Keys Configuration
// يمكن إضافة مفاتيح API هنا للترقية المستقبلية

const API_KEYS = {
  // Google Gemini API
  GEMINI: {
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
    model: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  },
  
  // OpenRouter API
  OPENROUTER: {
    apiKey: process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key',
    model: 'google/gemini-flash-1.5',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  
  // OpenAI API
  OPENAI: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    model: 'gpt-3.5-turbo',
    baseUrl: 'https://api.openai.com/v1'
  },
  
  // YouTube API
  YOUTUBE: {
    apiKey: process.env.YOUTUBE_API_KEY || 'your-youtube-api-key',
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  }
};

// إعدادات API
const API_CONFIG = {
  // نوع API المستخدم
  provider: process.env.AI_PROVIDER || 'LOCAL', // LOCAL, GEMINI, OPENROUTER, OPENAI
  
  // إعدادات الرد
  temperature: 0.7,
  maxTokens: 1000,
  timeout: 30000, // 30 ثانية
  
  // إعدادات التخزين المؤقت
  cacheEnabled: true,
  cacheTimeout: 300000, // 5 دقائق
};

// دالة للتحقق من صحة API Keys
const validateAPIKeys = () => {
  const provider = API_CONFIG.provider;
  
  if (provider === 'LOCAL') {
    return { valid: true, message: 'Using local chat API' };
  }
  
  const requiredKey = API_KEYS[provider]?.apiKey;
  
  if (!requiredKey || requiredKey.includes('your-')) {
    return { 
      valid: false, 
      message: `Please set ${provider}_API_KEY environment variable` 
    };
  }
  
  return { valid: true, message: `${provider} API key is configured` };
};

// دالة للحصول على إعدادات API
const getAPIConfig = (provider = API_CONFIG.provider) => {
  return {
    ...API_KEYS[provider],
    ...API_CONFIG
  };
};

export { API_KEYS, API_CONFIG, validateAPIKeys, getAPIConfig };
export default { API_KEYS, API_CONFIG, validateAPIKeys, getAPIConfig };
