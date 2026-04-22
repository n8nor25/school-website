// AI Service Factory - TypeScript Version
// مصنع خدمات الذكاء الاصطناعي - يدعم جميع أنواع API

import { validateAPIKeys, getAPIConfig } from '../config/api-config';
import { localChatAPI } from '../api/local-chat';

// Mock services for now
const GeminiService = {
  async sendMessage(message: string, subject: string, studentId: string) {
    return {
      reply: `Gemini API response for: ${message}`,
      timestamp: new Date().toISOString(),
      studentId,
      subject,
      messageId: Date.now().toString()
    };
  }
};

const OpenRouterService = {
  async sendMessage(message: string, subject: string, studentId: string) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alsharq-academia.com',
          'X-Title': 'Alsharq Academia Chat'
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [
            {
              role: 'system',
              content: `أنت مساعد تعليمي ذكي متخصص في مساعدة الطلاب في أكاديمية الشرق. أنت متخصص في ${subject}. اشرح المفاهيم بطريقة مبسطة مع أمثلة عملية. الرد باللغة العربية.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          reply: data.choices[0].message.content,
          timestamp: new Date().toISOString(),
          studentId,
          subject,
          messageId: Date.now().toString()
        };
      } else {
        throw new Error('No response from OpenRouter API');
      }

    } catch (error) {
      console.error('OpenRouter Service Error:', error);
      throw new Error('حدث خطأ في التواصل مع المساعد الذكي');
    }
  }
};

class AIServiceFactory {
  private services: any;

  constructor() {
    this.services = {
      LOCAL: localChatAPI,
      GEMINI: GeminiService,
      OPENROUTER: OpenRouterService
    };
  }

  // الحصول على الخدمة المناسبة
  getService(provider: string | null = null) {
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
  async processMessage(message: string, studentId: string, subject: string = 'عام', provider: string | null = null) {
    try {
      const service = this.getService(provider);
      
      if (service === this.services.LOCAL) {
        // استخدام API المحلي
        return await service.processMessage(message, studentId, subject);
      } else {
        // استخدام API خارجي
        const response = await service.sendMessage(message, subject, studentId);
        
        // إضافة فيديوهات مقترحة
        const videoLinks = [
          'https://www.youtube.com/watch?v=example1',
          'https://www.youtube.com/watch?v=example2'
        ];
        
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
  switchService(provider: string) {
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
