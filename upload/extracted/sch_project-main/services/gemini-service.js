// Google Gemini API Service
// تكامل مع Google Gemini API

import { getAPIConfig } from '../config/api-config.js';

class GeminiService {
  constructor() {
    this.config = getAPIConfig('GEMINI');
    this.apiKey = this.config.apiKey;
    this.model = this.config.model;
    this.baseUrl = this.config.baseUrl;
  }

  // إرسال رسالة إلى Gemini API
  async sendMessage(message, subject = 'عام', studentId = null) {
    try {
      const prompt = this.buildPrompt(message, subject);
      
      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return {
          reply: data.candidates[0].content.parts[0].text,
          timestamp: new Date().toISOString(),
          studentId,
          subject,
          messageId: Date.now().toString()
        };
      } else {
        throw new Error('No response from Gemini API');
      }

    } catch (error) {
      console.error('Gemini Service Error:', error);
      throw new Error('حدث خطأ في التواصل مع المساعد الذكي');
    }
  }

  // بناء الـ prompt
  buildPrompt(message, subject) {
    return `
      أنت مساعد تعليمي ذكي متخصص في مساعدة الطلاب في أكاديمية الشرق.
      
      المادة الدراسية: ${subject}
      سؤال الطالب: ${message}
      
      يرجى تقديم:
      1. شرح واضح ومبسط للموضوع
      2. أمثلة عملية توضيحية
      3. نصائح للفهم والدراسة
      4. اقتراحات للتحسين
      
      الرد باللغة العربية وبطريقة ودودة ومفيدة.
    `;
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

export default GeminiService;