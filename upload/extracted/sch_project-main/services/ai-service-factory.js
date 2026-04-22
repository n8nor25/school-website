// AI Service Factory
// مصنع خدمات الذكاء الاصطناعي - يدعم جميع أنواع API

import { validateAPIKeys, getAPIConfig } from '../config/api-config.js';
import { localChatAPI } from '../api/local-chat.js';
import GeminiService from './gemini-service.js';
import OpenRouterService from './openrouter-service.js';

class AIServiceFactory {
  constructor() {
    this.services = {
      LOCAL: localChatAPI,
      GEMINI: new GeminiService(),
      OPENROUTER: new OpenRouterService()
    };
  }

  // الحصول على الخدمة المناسبة
  getService(provider = null) {
    const config = getAPIConfig(provider);
    const validation = validateAPIKeys();
    
    // إذا كان API غير متوفر، استخدم المحلي
    if (!validation.valid || !this.services[config.provider]) {
      console.warn('Using local chat API as fallback');
      return this.services.LOCAL;
    }
    
    console.log(`Using ${config.provider} API service`);
    return this.services[config.provider];
  }

  // معالجة الرسالة مع الخدمة المناسبة
  async processMessage(message, studentId, subject = 'عام', provider = null) {
    try {
      const service = this.getService(provider);
      
      if (service === this.services.LOCAL) {
        // استخدام API المحلي
        return await service.processMessage(message, studentId, subject);
      } else {
        // استخدام API خارجي
        const response = await service.sendMessage(message, subject, studentId);
        
        // إضافة فيديوهات مقترحة
        const videoLinks = await service.searchEducationalVideos(message, subject);
        
        return {
          ...response,
          videoLinks
        };
      }
      
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // في حالة الخطأ، استخدم API المحلي كبديل
      console.warn('Falling back to local chat API');
      return await this.services.LOCAL.processMessage(message, studentId, subject);
    }
  }

  // الحصول على معلومات الخدمة
  getServiceInfo() {
    const validation = validateAPIKeys();
    const config = getAPIConfig();
    
    return {
      provider: config.provider,
      valid: validation.valid,
      message: validation.message,
      availableServices: Object.keys(this.services)
    };
  }

  // تبديل نوع الخدمة
  switchService(provider) {
    const validation = validateAPIKeys();
    
    if (provider === 'LOCAL' || validation.valid) {
      return this.getService(provider);
    } else {
      console.warn(`Service ${provider} not available, using LOCAL`);
      return this.services.LOCAL;
    }
  }
}

// إنشاء instance واحد للاستخدام
const aiServiceFactory = new AIServiceFactory();

export { aiServiceFactory };
export default aiServiceFactory;
