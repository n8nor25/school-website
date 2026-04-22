// AI Configuration for Smart Chat Assistant
// This file contains configuration for different AI services

const AI_CONFIG = {
  // Google Gemini API Configuration
  GEMINI: {
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
    model: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    maxTokens: 1000,
    temperature: 0.7
  },

  // OpenAI API Configuration
  OPENAI: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    model: 'gpt-3.5-turbo',
    baseUrl: 'https://api.openai.com/v1',
    maxTokens: 1000,
    temperature: 0.7
  },

  // Hugging Face API Configuration
  HUGGINGFACE: {
    apiKey: process.env.HUGGINGFACE_API_KEY || 'your-hf-api-key',
    model: 'microsoft/DialoGPT-medium',
    baseUrl: 'https://api-inference.huggingface.co/models'
  },

  // YouTube API Configuration for educational videos
  YOUTUBE: {
    apiKey: process.env.YOUTUBE_API_KEY || 'your-youtube-api-key',
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    maxResults: 3
  }
};

// AI Service Selection
const AI_SERVICE = process.env.AI_SERVICE || 'GEMINI'; // GEMINI, OPENAI, HUGGINGFACE

// Educational prompts for different subjects
const EDUCATIONAL_PROMPTS = {
  'الرياضيات': {
    systemPrompt: 'أنت مساعد تعليمي متخصص في الرياضيات. اشرح المفاهيم بطريقة مبسطة مع أمثلة عملية.',
    keywords: ['رياضيات', 'math', 'حساب', 'جبر', 'هندسة', 'إحصاء']
  },
  'العلوم': {
    systemPrompt: 'أنت مساعد تعليمي متخصص في العلوم. اشرح الظواهر العلمية بطريقة واضحة ومفهومة.',
    keywords: ['علوم', 'science', 'فيزياء', 'كيمياء', 'أحياء', 'تجارب']
  },
  'اللغة العربية': {
    systemPrompt: 'أنت مساعد تعليمي متخصص في اللغة العربية. ساعد في النحو والصرف والأدب.',
    keywords: ['عربي', 'نحو', 'صرف', 'أدب', 'شعر', 'نثر']
  },
  'اللغة الإنجليزية': {
    systemPrompt: 'أنت مساعد تعليمي متخصص في اللغة الإنجليزية. ساعد في القواعد والمفردات والمحادثة.',
    keywords: ['english', 'grammar', 'vocabulary', 'conversation', 'writing']
  },
  'عام': {
    systemPrompt: 'أنت مساعد تعليمي ذكي يساعد الطلاب في جميع المواد الدراسية. قدم شرحاً واضحاً ومفيداً.',
    keywords: ['دراسة', 'تعليم', 'مساعدة', 'شرح', 'تلخيص']
  }
};

// YouTube search queries for different subjects
const YOUTUBE_SEARCH_QUERIES = {
  'الرياضيات': ['شرح الرياضيات', 'math tutorial', 'رياضيات ثانوي', 'math problems'],
  'العلوم': ['شرح العلوم', 'science tutorial', 'تجارب علمية', 'physics chemistry'],
  'اللغة العربية': ['شرح النحو', 'قواعد اللغة العربية', 'أدب عربي', 'شعر عربي'],
  'اللغة الإنجليزية': ['english grammar', 'learn english', 'english conversation', 'english vocabulary'],
  'عام': ['تعليم', 'education', 'دراسة', 'learning']
};

// Function to get AI service configuration
const getAIConfig = () => {
  return AI_CONFIG[AI_SERVICE];
};

// Function to get educational prompt for subject
const getEducationalPrompt = (subject) => {
  return EDUCATIONAL_PROMPTS[subject] || EDUCATIONAL_PROMPTS['عام'];
};

// Function to get YouTube search queries for subject
const getYouTubeQueries = (subject) => {
  return YOUTUBE_SEARCH_QUERIES[subject] || YOUTUBE_SEARCH_QUERIES['عام'];
};

// Function to format AI response for educational context
const formatEducationalResponse = (response, subject) => {
  const prompt = getEducationalPrompt(subject);
  
  return {
    reply: response,
    subject,
    timestamp: new Date().toISOString(),
    isEducational: true,
    suggestedActions: [
      'طلب شرح إضافي',
      'طلب أمثلة عملية',
      'طلب تلخيص',
      'طلب فيديوهات تعليمية'
    ]
  };
};

module.exports = {
  AI_CONFIG,
  AI_SERVICE,
  getAIConfig,
  getEducationalPrompt,
  getYouTubeQueries,
  formatEducationalResponse,
  EDUCATIONAL_PROMPTS,
  YOUTUBE_SEARCH_QUERIES
};
