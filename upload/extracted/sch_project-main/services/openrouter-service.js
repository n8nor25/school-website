// OpenRouter API Service
// بديل مجاني لـ Gemini API

import { getAPIConfig } from '../config/api-config.js';

class OpenRouterService {
  constructor() {
    this.config = getAPIConfig('OPENROUTER');
    this.apiKey = this.config.apiKey;
    this.baseUrl = this.config.baseUrl;
    this.model = this.config.model;
  }

  // إرسال رسالة إلى OpenRouter API
  async sendMessage(message, subject = 'عام', studentId = null) {
    try {
      const prompt = this.buildPrompt(message, subject);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alsharq-academia.com',
          'X-Title': 'Alsharq Academia Chat'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(subject)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
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

  // بناء الـ prompt
  buildPrompt(message, subject) {
    return `
      أنت مساعد تعليمي ذكي لأكاديمية الشرق. 
      المادة: ${subject}
      سؤال الطالب: ${message}
      
      يرجى تقديم:
      1. شرح واضح ومبسط
      2. أمثلة عملية إذا أمكن
      3. نصائح للفهم
      4. اقتراحات للدراسة
      
      الرد باللغة العربية.
    `;
  }

  // الحصول على system prompt
  getSystemPrompt(subject) {
    const basePrompt = `أنت مساعد تعليمي ذكي متخصص في مساعدة الطلاب في أكاديمية الشرق. أنت متخصص في ${subject}.`;
    
    const subjectPrompts = {
      'الرياضيات': 'أنت متخصص في الرياضيات. اشرح المفاهيم بطريقة مبسطة مع أمثلة عملية.',
      'العلوم': 'أنت متخصص في العلوم. اشرح الظواهر العلمية بطريقة واضحة ومفهومة.',
      'اللغة العربية': 'أنت متخصص في اللغة العربية. ساعد في النحو والصرف والأدب.',
      'اللغة الإنجليزية': 'أنت متخصص في اللغة الإنجليزية. ساعد في القواعد والمفردات والمحادثة.',
      'عام': 'أنت مساعد تعليمي عام يساعد الطلاب في جميع المواد الدراسية.'
    };

    return subjectPrompts[subject] || subjectPrompts['عام'];
  }

  // البحث عن فيديوهات تعليمية
  async searchEducationalVideos(query, subject) {
    try {
      // في التطبيق الحقيقي، يمكن ربط هذا مع YouTube API
      const mockVideos = {
        'الرياضيات': [
          'https://www.youtube.com/watch?v=math1',
          'https://www.youtube.com/watch?v=math2'
        ],
        'العلوم': [
          'https://www.youtube.com/watch?v=science1',
          'https://www.youtube.com/watch?v=science2'
        ],
        'اللغة العربية': [
          'https://www.youtube.com/watch?v=arabic1'
        ],
        'اللغة الإنجليزية': [
          'https://www.youtube.com/watch?v=english1'
        ]
      };

      return mockVideos[subject] || mockVideos['الرياضيات'];

    } catch (error) {
      console.error('Video Search Error:', error);
      return [];
    }
  }
}

export default OpenRouterService;
