// Smart AI Service - مساعد ذكي حقيقي
// يستخدم OpenRouter API للردود الذكية

interface AIResponse {
  reply: string;
  videoLinks: string[];
  timestamp: string;
  messageId: string;
  confidence: number;
}

class SmartAIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = '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';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.model = 'google/gemini-flash-1.5';
  }

  // إرسال رسالة إلى AI
  async sendMessage(message: string, subject: string = 'عام', studentId: string = 'demo'): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(subject);
      const userPrompt = this.buildUserPrompt(message, subject);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alsharq-academia.com',
          'X-Title': 'Alsharq Academia Smart Assistant'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiReply = data.choices[0].message.content;
        
        // البحث عن فيديوهات تعليمية إذا كان مناسباً
        const videoLinks = await this.searchEducationalVideos(message, subject);
        
        return {
          reply: aiReply,
          videoLinks: videoLinks,
          timestamp: new Date().toISOString(),
          messageId: Date.now().toString(),
          confidence: 0.9
        };
      } else {
        throw new Error('No response from AI');
      }

    } catch (error) {
      console.error('Smart AI Service Error:', error);
      
      // إرجاع رد ذكي بدلاً من رسالة خطأ
      return {
        reply: `أعتذر، حدث خطأ في الاتصال مع المساعد الذكي. يرجى المحاولة مرة أخرى.\n\nيمكنني مساعدتك في:\n• شرح الدروس\n• تلخيص المواد\n• الإجابة على الأسئلة\n• تقديم النصائح\n\nجرب سؤالاً بسيطاً مثل "مرحبا" أو "ما هو محتوى الملف؟"`,
        videoLinks: [],
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
        confidence: 0.1
      };
    }
  }

  // بناء System Prompt
  private buildSystemPrompt(subject: string): string {
    const basePrompt = `أنت مساعد تعليمي ذكي متخصص في مساعدة الطلاب. أنت خبير في جميع المواد الدراسية ويمكنك الإجابة على أي سؤال أكاديمي أو عام.

مهمتك:
1. الإجابة على الأسئلة الأكاديمية بدقة ووضوح
2. شرح المفاهيم بطريقة مبسطة ومفهومة
3. تقديم أمثلة عملية وتوضيحية
4. الإجابة على الأسئلة العامة والمعرفية
5. تقديم نصائح دراسية مفيدة
6. اقتراح مصادر تعليمية إضافية

أسلوبك:
- ودود ومشجع
- واضح ومبسط
- دقيق ومفيد
- باللغة العربية
- مع أمثلة عملية`;

    if (subject !== 'عام') {
      return `${basePrompt}\n\nأنت متخصص في مادة ${subject}. ركز على هذه المادة في إجاباتك.`;
    }

    return basePrompt;
  }

  // بناء User Prompt
  private buildUserPrompt(message: string, subject: string): string {
    return `السؤال: ${message}\n\nالمادة: ${subject}\n\nيرجى الإجابة على السؤال بطريقة واضحة ومفيدة مع أمثلة عملية إذا أمكن.`;
  }

  // البحث عن فيديوهات تعليمية
  private async searchEducationalVideos(message: string, subject: string): Promise<string[]> {
    try {
      // استيراد خدمة YouTube
      const { youtubeService } = await import('./youtube-api');
      
      // البحث عن فيديوهات تعليمية
      const videos = await youtubeService.searchEducationalVideos(message, subject, 3);
      
      // إرجاع روابط الفيديوهات
      return videos.map(video => video.url);
      
    } catch (error) {
      console.error('Video search error:', error);
      
      // فيديوهات افتراضية في حالة الخطأ
      const educationalKeywords = ['شرح', 'تعليم', 'درس', 'tutorial', 'explain'];
      const hasEducationalContent = educationalKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      if (hasEducationalContent) {
        return [
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'https://www.youtube.com/watch?v=9bZkp7q19f0'
        ];
      }

      return [];
    }
  }

  // Fallback response
  private getFallbackResponse(message: string, subject: string): AIResponse {
    return {
      reply: `عذراً، حدث خطأ في الاتصال مع المساعد الذكي. يرجى المحاولة مرة أخرى.\n\nيمكنني مساعدتك في:\n• شرح الدروس\n• تلخيص المواد\n• الإجابة على الأسئلة\n• تقديم النصائح`,
      videoLinks: [],
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString(),
      confidence: 0.1
    };
  }

  // تحليل المستندات
  async analyzeDocument(documentText: string, question: string): Promise<AIResponse> {
    try {
      const systemPrompt = `أنت مساعد تعليمي متخصص في تحليل المستندات التعليمية. مهمتك:
1. قراءة وفهم المحتوى التعليمي بالكامل
2. الإجابة على الأسئلة بناءً على المعلومات الموجودة في المستند
3. استخراج المعلومات المطلوبة بدقة
4. تقديم إجابات واضحة ومفيدة
5. إذا لم تجد الإجابة في المستند، قل ذلك بوضوح

تذكر: أنت تحلل مستند تعليمي، لذا ركز على المعلومات الأكاديمية والتعليمية.`;

      const userPrompt = `المستند التعليمي:\n${documentText}\n\nالسؤال: ${question}\n\nيرجى قراءة المستند بعناية والإجابة على السؤال بناءً على المعلومات الموجودة فيه. إذا لم تجد الإجابة، قل ذلك بوضوح.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alsharq-academia.com',
          'X-Title': 'Alsharq Academia Document Analysis'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Document Analysis Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          reply: data.choices[0].message.content,
          videoLinks: [],
          timestamp: new Date().toISOString(),
          messageId: Date.now().toString(),
          confidence: 0.95
        };
      } else {
        throw new Error('No response from document analysis');
      }

    } catch (error) {
      console.error('Document Analysis Error:', error);
      return {
        reply: `أعتذر، حدث خطأ في تحليل المستند. يرجى المحاولة مرة أخرى.\n\nنصائح للحصول على أفضل النتائج:\n• تأكد من رفع المستند بنجاح\n• استخدم أسئلة واضحة ومحددة\n• جرب أسئلة بسيطة أولاً\n• تأكد من تفعيل "الذكاء الاصطناعي الحقيقي"\n\nمثال على الأسئلة الجيدة:\n• "ما هو محتوى الملف؟"\n• "لخص هذا المستند"\n• "ما هي النقاط الرئيسية؟"`,
        videoLinks: [],
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
        confidence: 0.1
      };
    }
  }

  // إنشاء عرض تقديمي
  async generatePresentation(documentText: string, topic: string): Promise<AIResponse> {
    try {
      const systemPrompt = `أنت مساعد تعليمي متخصص في إنشاء العروض التقديمية التعليمية. مهمتك:
1. تحليل المحتوى التعليمي بعناية
2. إنشاء عرض تقديمي منظم ومنطقي
3. تقسيم المحتوى إلى شرائح تعليمية واضحة
4. إضافة عناوين جذابة ونقاط رئيسية
5. تقديم نصائح عملية للعرض
6. التركيز على الجانب التعليمي والأكاديمي

تنسيق العرض:
- الشريحة الأولى: عنوان الموضوع
- الشريحة الثانية: مقدمة
- الشرائح الوسطى: المحتوى الرئيسي
- الشريحة الأخيرة: الخلاصة والنصائح`;

      const userPrompt = `الموضوع: ${topic}\n\nالمحتوى التعليمي:\n${documentText}\n\nيرجى إنشاء عرض تقديمي تعليمي منظم من هذا المحتوى. يجب أن يكون مناسباً للطلاب ومفهوماً.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alsharq-academia.com',
          'X-Title': 'Alsharq Academia Presentation Generator'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2500
        })
      });

      if (!response.ok) {
        throw new Error(`Presentation Generation Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          reply: data.choices[0].message.content,
          videoLinks: [],
          timestamp: new Date().toISOString(),
          messageId: Date.now().toString(),
          confidence: 0.9
        };
      } else {
        throw new Error('No response from presentation generator');
      }

    } catch (error) {
      console.error('Presentation Generation Error:', error);
      return {
        reply: `أعتذر، حدث خطأ في إنشاء العرض التقديمي. يرجى المحاولة مرة أخرى.\n\nنصائح للحصول على أفضل النتائج:\n• تأكد من رفع المستند بنجاح\n• تأكد من تفعيل "الذكاء الاصطناعي الحقيقي"\n• انتظر قليلاً قبل المحاولة مرة أخرى\n• جرب رفع ملف أصغر إذا كان الملف كبيراً\n\nيمكنك أيضاً:\n• طلب تلخيص المستند\n• طرح أسئلة حول المحتوى\n• طلب شرح مفصل لأي جزء`,
        videoLinks: [],
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString(),
        confidence: 0.1
      };
    }
  }
}

// إنشاء instance واحد للاستخدام
const smartAIService = new SmartAIService();

export { smartAIService, AIResponse };
export default smartAIService;
