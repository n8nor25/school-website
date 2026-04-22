// Complete Chat Integration API
// This file integrates all services for the Smart Chat Assistant

const GeminiService = require('../services/gemini-service');
const YouTubeService = require('../services/youtube-service');
const { formatEducationalResponse } = require('../config/ai-config');

class ChatIntegration {
  constructor() {
    this.geminiService = new GeminiService();
    this.youtubeService = new YouTubeService();
  }

  // Main chat processing function
  async processMessage(message, studentId, subject = 'عام') {
    try {
      console.log(`Processing message from student ${studentId}: ${message}`);
      
      // Get AI response
      const aiResponse = await this.geminiService.sendMessage(message, subject, studentId);
      
      // Get video recommendations
      const videoRecommendations = await this.youtubeService.searchEducationalVideos(
        subject, 
        message, 
        3
      );
      
      // Combine AI response with video recommendations
      const enhancedResponse = {
        ...aiResponse,
        videoLinks: videoRecommendations.map(video => video.url),
        videoDetails: videoRecommendations,
        timestamp: new Date().toISOString(),
        studentId,
        subject
      };

      // Store in database (in production)
      await this.storeChatHistory(enhancedResponse);

      return enhancedResponse;

    } catch (error) {
      console.error('Chat Integration Error:', error);
      
      // Return fallback response
      return {
        reply: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        videoLinks: [],
        subject,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }

  // Store chat history in database
  async storeChatHistory(chatData) {
    try {
      // In production, this would save to database
      console.log('Storing chat history:', {
        studentId: chatData.studentId,
        subject: chatData.subject,
        messageLength: chatData.reply.length,
        videoCount: chatData.videoLinks.length
      });

      // Mock database storage
      const chatRecord = {
        id: Date.now().toString(),
        studentId: chatData.studentId,
        message: chatData.originalMessage || 'User message',
        response: chatData.reply,
        subject: chatData.subject,
        videoLinks: chatData.videoLinks,
        timestamp: chatData.timestamp
      };

      // In production: await database.save('chat_history', chatRecord);
      return chatRecord;

    } catch (error) {
      console.error('Database Storage Error:', error);
      // Don't throw error to avoid breaking the chat flow
    }
  }

  // Get chat history for a student
  async getChatHistory(studentId, limit = 50) {
    try {
      // In production, fetch from database
      const mockHistory = [
        {
          id: '1',
          message: 'مرحباً',
          response: 'أهلاً وسهلاً! كيف يمكنني مساعدتك؟',
          subject: 'عام',
          timestamp: new Date().toISOString()
        }
      ];

      return mockHistory;

    } catch (error) {
      console.error('Get Chat History Error:', error);
      return [];
    }
  }

  // Get study analytics for a student
  async getStudyAnalytics(studentId) {
    try {
      // In production, calculate from database
      const analytics = {
        totalQuestions: 0,
        subjectsCovered: [],
        studyTime: 0,
        lastStudyDate: null,
        favoriteSubject: null,
        improvementAreas: []
      };

      return analytics;

    } catch (error) {
      console.error('Analytics Error:', error);
      return null;
    }
  }

  // Get personalized study recommendations
  async getStudyRecommendations(studentId, subject) {
    try {
      const recommendations = {
        studyTips: await this.geminiService.generateStudyTips(subject),
        videoSuggestions: await this.youtubeService.getTrendingEducationalVideos(subject),
        practiceAreas: this.getPracticeAreas(subject),
        studySchedule: this.generateStudySchedule(subject)
      };

      return recommendations;

    } catch (error) {
      console.error('Recommendations Error:', error);
      return {
        studyTips: ['راجع الدروس بانتظام', 'حل المسائل التدريبية'],
        videoSuggestions: [],
        practiceAreas: [],
        studySchedule: []
      };
    }
  }

  // Get practice areas for a subject
  getPracticeAreas(subject) {
    const practiceAreas = {
      'الرياضيات': ['الجبر', 'الهندسة', 'الإحصاء', 'التفاضل والتكامل'],
      'العلوم': ['الفيزياء', 'الكيمياء', 'الأحياء', 'علوم الأرض'],
      'اللغة العربية': ['النحو', 'الصرف', 'الأدب', 'الشعر'],
      'اللغة الإنجليزية': ['القواعد', 'المفردات', 'المحادثة', 'الكتابة']
    };

    return practiceAreas[subject] || practiceAreas['عام'] || [];
  }

  // Generate study schedule
  generateStudySchedule(subject) {
    return [
      { day: 'الاثنين', topic: 'مراجعة الدروس', duration: '30 دقيقة' },
      { day: 'الثلاثاء', topic: 'حل المسائل', duration: '45 دقيقة' },
      { day: 'الأربعاء', topic: 'مراجعة القوانين', duration: '30 دقيقة' },
      { day: 'الخميس', topic: 'التطبيق العملي', duration: '60 دقيقة' },
      { day: 'الجمعة', topic: 'المراجعة الشاملة', duration: '45 دقيقة' }
    ];
  }

  // Handle different types of queries
  async handleQueryType(message, studentId, subject) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('شرح') || lowerMessage.includes('explain')) {
      return await this.handleExplanationRequest(message, studentId, subject);
    } else if (lowerMessage.includes('تلخيص') || lowerMessage.includes('summary')) {
      return await this.handleSummaryRequest(message, studentId, subject);
    } else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
      return await this.handleHelpRequest(studentId, subject);
    } else if (lowerMessage.includes('فيديو') || lowerMessage.includes('video')) {
      return await this.handleVideoRequest(message, studentId, subject);
    } else {
      return await this.handleGeneralQuery(message, studentId, subject);
    }
  }

  // Handle explanation requests
  async handleExplanationRequest(message, studentId, subject) {
    const explanationPrompt = `
      يرجى شرح الموضوع التالي بطريقة مبسطة ومفهومة:
      ${message}
      
      المادة: ${subject}
      
      يرجى تقديم:
      1. شرح خطوة بخطوة
      2. أمثلة توضيحية
      3. نصائح للفهم
    `;

    return await this.processMessage(explanationPrompt, studentId, subject);
  }

  // Handle summary requests
  async handleSummaryRequest(message, studentId, subject) {
    const summaryPrompt = `
      يرجى تلخيص المحتوى التالي في نقاط واضحة:
      ${message}
      
      المادة: ${subject}
      
      يرجى تقديم:
      1. النقاط الرئيسية
      2. المفاهيم المهمة
      3. النصائح للفهم
    `;

    return await this.processMessage(summaryPrompt, studentId, subject);
  }

  // Handle help requests
  async handleHelpRequest(studentId, subject) {
    const helpMessage = `أحتاج مساعدة في ${subject}. ما هي أفضل طريقة للدراسة؟`;
    return await this.processMessage(helpMessage, studentId, subject);
  }

  // Handle video requests
  async handleVideoRequest(message, studentId, subject) {
    const videoMessage = `أريد فيديوهات تعليمية عن ${message} في مادة ${subject}`;
    return await this.processMessage(videoMessage, studentId, subject);
  }

  // Handle general queries
  async handleGeneralQuery(message, studentId, subject) {
    return await this.processMessage(message, studentId, subject);
  }
}

module.exports = ChatIntegration;
