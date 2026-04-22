import React, { useState } from 'react';
import { youtubeService } from '../services/youtube-api';
import { smartAIService } from '../services/smart-ai-service';
import DocumentUpload from './DocumentUpload';
import SavedDocumentsManager from './SavedDocumentsManager';
import { SavedFile } from '../services/file-storage-service';

interface SmartAssistantProps {
  studentId?: string;
  studentName?: string;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ 
  studentId = 'demo-student', 
  studentName = 'الطالب' 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, from: 'user' | 'bot', text: string, timestamp: Date, videoLinks?: string[]}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isSavedDocumentsOpen, setIsSavedDocumentsOpen] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<{file: File, text: string} | null>(null);
  const [useSmartAI, setUseSmartAI] = useState(true);

  const subjects = [
    'الرياضيات',
    'العلوم',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التاريخ',
    'الجغرافيا',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'عام'
  ];

  // Mock AI responses
  const getMockAIResponse = (message: string, subject: string = 'عام') => {
    const responses = {
      'مرحبا': {
        reply: `مرحباً! أنا المساعد الذكي. أنا هنا لمساعدتك في دراستك. يمكنني:\n\n• شرح الدروس بطريقة مبسطة\n• تلخيص المواد في نقاط واضحة\n• اقتراح فيديوهات تعليمية\n• الإجابة على الأسئلة الأكاديمية\n• تقديم نصائح دراسية\n\nما الذي تريد المساعدة فيه؟`,
        videoLinks: []
      },
      'شرح': {
        reply: `أهلاً! سأقوم بشرح الموضوع لك بطريقة مبسطة ومفهومة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nيرجى تحديد الموضوع الذي تريد شرحه، وسأقوم بشرحه لك خطوة بخطوة مع أمثلة توضيحية.`,
        videoLinks: [
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'https://www.youtube.com/watch?v=9bZkp7q19f0'
        ]
      },
      'تلخيص': {
        reply: `سأقوم بتلخيص الموضوع لك في نقاط واضحة ومفهومة. ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nيرجى تحديد الموضوع الذي تريد تلخيصه، وسأقدم لك النقاط الرئيسية والمفاهيم المهمة.`,
        videoLinks: []
      },
      'مساعدة': {
        reply: `أنا هنا لمساعدتك في دراستك! يمكنني مساعدتك في:\n\n📚 **شرح الدروس**: شرح أي درس بطريقة مبسطة\n📝 **تلخيص المواد**: تلخيص الدروس في نقاط واضحة\n🎥 **الفيديوهات**: اقتراح فيديوهات تعليمية مفيدة\n❓ **الأسئلة**: الإجابة على أسئلتك الأكاديمية\n💡 **النصائح**: تقديم نصائح دراسية مخصصة\n\nما الذي تحتاج مساعدة فيه تحديداً؟`,
        videoLinks: []
      },
      'شكرا': {
        reply: `العفو! أنا سعيد جداً لمساعدتك. 😊\n\nإذا كان لديك أي أسئلة أخرى أو تحتاج مساعدة في أي موضوع، فلا تتردد في سؤالي. أنا هنا دائماً لمساعدتك في دراستك!\n\nأتمنى لك التوفيق والنجاح! 🎓✨`,
        videoLinks: []
      },
      'رياضيات': {
        reply: `أهلاً! سأساعدك في الرياضيات. يمكنني شرح:\n\n🔢 **الجبر**: المعادلات والمتغيرات\n📐 **الهندسة**: الأشكال والزوايا\n📊 **الإحصاء**: البيانات والرسوم البيانية\n📈 **التفاضل والتكامل**: للمراحل المتقدمة\n\nما هو الموضوع الذي تريد شرحه في الرياضيات؟`,
        videoLinks: ['https://www.youtube.com/watch?v=math1', 'https://www.youtube.com/watch?v=math2']
      },
      'علوم': {
        reply: `أهلاً! سأساعدك في العلوم. يمكنني شرح:\n\n⚗️ **الكيمياء**: العناصر والتفاعلات\n🔬 **الفيزياء**: القوى والطاقة\n🧬 **الأحياء**: الكائنات الحية\n🌍 **علوم الأرض**: البيئة والطبيعة\n\nما هو الموضوع الذي تريد شرحه في العلوم؟`,
        videoLinks: [
          'https://www.youtube.com/watch?v=H8WJ2KENlK0',
          'https://www.youtube.com/watch?v=WUvTyaaNkzM'
        ]
      },
      'عربي': {
        reply: `أهلاً! سأساعدك في اللغة العربية. يمكنني شرح:\n\n📖 **النحو**: قواعد اللغة العربية\n✍️ **الصرف**: تحليل الكلمات\n📚 **الأدب**: الشعر والنثر\n🗣️ **البلاغة**: فنون الكلام\n\nما هو الموضوع الذي تريد شرحه في اللغة العربية؟`,
        videoLinks: ['https://www.youtube.com/watch?v=arabic1']
      },
      'انجليزي': {
        reply: `Hello! I can help you with English. I can explain:\n\n📝 **Grammar**: Rules and structures\n📚 **Vocabulary**: Words and meanings\n🗣️ **Conversation**: Speaking skills\n✍️ **Writing**: Composition and essays\n\nWhat topic would you like help with in English?`,
        videoLinks: ['https://www.youtube.com/watch?v=english1']
      },
      'عاصمة': {
        reply: `عاصمة لبنان هي بيروت. بيروت هي العاصمة السياسية والاقتصادية والثقافية للجمهورية اللبنانية، وتقع على الساحل الشرقي للبحر الأبيض المتوسط.\n\nمعلومات إضافية عن بيروت:\n• عدد السكان: حوالي 2.4 مليون نسمة\n• اللغة الرسمية: العربية\n• العملة: الليرة اللبنانية\n• المناخ: متوسطي معتدل\n• المعالم الشهيرة: الجامعة الأمريكية، المتحف الوطني، كورنيش بيروت\n\nهل تريد معلومات أكثر عن لبنان أو بيروت؟`,
        videoLinks: []
      },
      'لبنان': {
        reply: `لبنان دولة عربية تقع في الشرق الأوسط. إليك معلومات مهمة عن لبنان:\n\n🏛️ **العاصمة**: بيروت\n👑 **نظام الحكم**: جمهورية برلمانية\n💰 **العملة**: الليرة اللبنانية\n🗣️ **اللغة**: العربية (الرسمية)\n🌍 **الموقع**: الشرق الأوسط، على البحر الأبيض المتوسط\n\nلبنان دولة متنوعة ثقافياً ودينياً، وتشتهر بالتنوع الثقافي والسياحة والزراعة.`,
        videoLinks: []
      },
      'قطر': {
        reply: `قطر دولة عربية تقع في شبه الجزيرة العربية. إليك معلومات مهمة عن قطر:\n\n🏛️ **العاصمة**: الدوحة\n👑 **نظام الحكم**: إمارة وراثية\n💰 **العملة**: الريال القطري\n🗣️ **اللغة**: العربية (الرسمية)\n🌍 **الموقع**: شبه الجزيرة العربية\n\nقطر دولة غنية بالنفط والغاز الطبيعي، وتشتهر بقطر للطيران والاستثمارات الرياضية.`,
        videoLinks: []
      },
      'default': {
        reply: `شكراً لسؤالك! ${subject !== 'عام' ? `في مادة ${subject}:` : ''}\n\nأنا المساعد الذكي. يمكنني مساعدتك في:\n\n📚 **شرح الدروس**: أي درس تريده\n📝 **تلخيص المواد**: في نقاط واضحة\n🎥 **الفيديوهات**: اقتراح فيديوهات تعليمية\n❓ **الأسئلة**: الإجابة على أسئلتك\n💡 **النصائح**: نصائح دراسية مفيدة\n\nما الذي تريد المساعدة فيه تحديداً؟`,
        videoLinks: []
      }
    };

    const lowerMessage = message.toLowerCase();
    
    // التحقق من الأسئلة الجغرافية أولاً
    if (lowerMessage.includes('عاصمة') && lowerMessage.includes('لبنان')) {
      return responses['عاصمة'];
    } else if (lowerMessage.includes('عاصمة') && lowerMessage.includes('قطر')) {
      return responses['عاصمة'];
    } else if (lowerMessage.includes('عاصمة') && (lowerMessage.includes('مصر') || lowerMessage.includes('سوريا') || lowerMessage.includes('العراق'))) {
      return {
        reply: `هذا سؤال جغرافي ممتاز! يرجى تحديد الدولة التي تريد معرفة عاصمتها، وسأقدم لك المعلومات الكاملة عنها.`,
        videoLinks: []
      };
    } else if (lowerMessage.includes('لبنان')) {
      return responses['لبنان'];
    } else if (lowerMessage.includes('قطر')) {
      return responses['قطر'];
    } else if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello') || lowerMessage.includes('أهلا')) {
      return responses['مرحبا'];
    } else if (lowerMessage.includes('شرح') || lowerMessage.includes('explain')) {
      return responses['شرح'];
    } else if (lowerMessage.includes('تلخيص') || lowerMessage.includes('summary')) {
      return responses['تلخيص'];
    } else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
      return responses['مساعدة'];
    } else if (lowerMessage.includes('شكرا') || lowerMessage.includes('شكراً')) {
      return responses['شكرا'];
    } else if (lowerMessage.includes('رياضيات') || lowerMessage.includes('math')) {
      return responses['رياضيات'];
    } else if (lowerMessage.includes('علوم') || lowerMessage.includes('science')) {
      return responses['علوم'];
    } else if (lowerMessage.includes('عربي') || lowerMessage.includes('arabic')) {
      return responses['عربي'];
    } else if (lowerMessage.includes('انجليزي') || lowerMessage.includes('english')) {
      return responses['انجليزي'];
    } else if (lowerMessage.includes('عاصمة') || lowerMessage.includes('capital')) {
      return {
        reply: `هذا سؤال جغرافي ممتاز! يرجى تحديد الدولة التي تريد معرفة عاصمتها، وسأقدم لك المعلومات الكاملة عنها.\n\nمثال: "ما عاصمة لبنان؟" أو "عاصمة مصر"`,
        videoLinks: []
      };
    } else {
      return responses['default'];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      from: 'user' as const,
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse;

      if (useSmartAI) {
        try {
          // استخدام المساعد الذكي الحقيقي
          if (uploadedDocument) {
            // تحليل المستند
            console.log('تحليل المستند:', uploadedDocument.file.name);
            aiResponse = await smartAIService.analyzeDocument(uploadedDocument.text, inputMessage);
          } else {
            // رد عادي
            console.log('استخدام الذكاء الاصطناعي الحقيقي');
            aiResponse = await smartAIService.sendMessage(inputMessage, selectedSubject || 'عام', studentId);
          }
        } catch (aiError) {
          console.error('AI Error:', aiError);
          // استخدام النظام البديل مع فيديوهات YouTube
          aiResponse = await getEnhancedMockResponse(inputMessage, selectedSubject || 'عام');
        }
      } else {
        // استخدام النظام القديم
        console.log('استخدام النظام القديم');
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        aiResponse = await getEnhancedMockResponse(inputMessage, selectedSubject || 'عام');
      }
      
      const botMessage = {
        id: aiResponse.messageId || (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: aiResponse.reply,
        timestamp: new Date(),
        videoLinks: aiResponse.videoLinks || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: `أعتذر، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.\n\nنصائح للحصول على أفضل النتائج:\n• تأكد من تفعيل "الذكاء الاصطناعي الحقيقي" ✅\n• استخدم أسئلة واضحة ومحددة\n• جرب أسئلة بسيطة أولاً\n• انتظر قليلاً قبل المحاولة مرة أخرى\n\nمثال على الأسئلة الجيدة:\n• "مرحبا"\n• "ما هو محتوى الملف؟"\n• "لخص هذا المستند"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEnhancedMockResponse = async (message: string, subject: string) => {
    // الحصول على رد أساسي
    const baseResponse = getMockAIResponse(message, subject);
    
    // إضافة فيديوهات YouTube إذا كان مناسباً
    try {
      const { youtubeService } = await import('../services/youtube-api');
      const videos = await youtubeService.searchEducationalVideos(message, subject, 2);
      baseResponse.videoLinks = videos.map(video => video.url);
    } catch (error) {
      console.error('YouTube API Error:', error);
      // استخدام فيديوهات افتراضية
      baseResponse.videoLinks = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=9bZkp7q19f0'
      ];
    }
    
    return baseResponse;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleDocumentUpload = (file: File, text: string) => {
    setUploadedDocument({ file, text });
    setIsDocumentUploadOpen(false);
    
    // إضافة رسالة تأكيد
    const confirmationMessage = {
      id: Date.now().toString(),
      from: 'bot' as const,
      text: `تم رفع المستند "${file.name}" بنجاح! يمكنك الآن طرح الأسئلة حوله أو طلب تلخيصه أو إنشاء عرض تقديمي منه.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleSavedDocumentSelect = (savedFile: SavedFile) => {
    // إنشاء File object من المستند المحفوظ
    const file = new File([savedFile.content], savedFile.originalName, { type: savedFile.fileType });
    
    setUploadedDocument({ file, text: savedFile.content });
    setIsSavedDocumentsOpen(false);
    
    // إضافة رسالة تأكيد
    const confirmationMessage = {
      id: Date.now().toString(),
      from: 'bot' as const,
      text: `تم فتح المستند المحفوظ "${savedFile.originalName}" بنجاح! يمكنك الآن طرح الأسئلة حوله أو طلب تلخيصه أو إنشاء عرض تقديمي منه.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const generatePresentation = async () => {
    if (!uploadedDocument) return;

    setIsLoading(true);
    try {
      console.log('إنشاء عرض تقديمي من:', uploadedDocument.file.name);
      
      let response;
      if (useSmartAI) {
        try {
          response = await smartAIService.generatePresentation(
            uploadedDocument.text, 
            `عرض تقديمي من ${uploadedDocument.file.name}`
          );
        } catch (aiError) {
          console.error('AI Error:', aiError);
          // استخدام النظام البديل
          response = generateMockPresentation(uploadedDocument.text, uploadedDocument.file.name);
        }
      } else {
        response = generateMockPresentation(uploadedDocument.text, uploadedDocument.file.name);
      }
      
      const botMessage = {
        id: response.messageId || (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: response.reply,
        timestamp: new Date(),
        videoLinks: response.videoLinks || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating presentation:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: `عذراً، حدث خطأ في إنشاء العرض التقديمي. يرجى المحاولة مرة أخرى.\n\nنصائح للحصول على أفضل النتائج:\n• تأكد من تفعيل "الذكاء الاصطناعي الحقيقي" ✅\n• تأكد من رفع المستند بنجاح\n• انتظر قليلاً قبل المحاولة مرة أخرى\n• جرب رفع ملف أصغر إذا كان الملف كبيراً\n\nيمكنك أيضاً:\n• طلب تلخيص المستند\n• طرح أسئلة حول المحتوى\n• طلب شرح مفصل لأي جزء`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPresentation = (documentText: string, fileName: string) => {
    const lines = documentText.split('\n').filter(line => line.trim());
    const title = lines[0] || fileName;
    const sections = lines.filter(line => line.includes('-') || line.includes('الدرس') || line.includes('الفصل'));
    
    const presentation = `🎯 **عرض تقديمي تعليمي من: ${fileName}**

📋 **الشريحة الأولى: عنوان الموضوع**
${title}

📖 **الشريحة الثانية: مقدمة**
هذا العرض التقديمي يعرض المحتوى التعليمي من المستند المرفوع بطريقة منظمة ومفهومة.

📚 **الشرائح الرئيسية:**
${sections.slice(0, 5).map((section, index) => `${index + 3}. ${section}`).join('\n')}

📊 **الشريحة الأخيرة: الخلاصة والنصائح**
• راجع المحتوى بانتظام
• استخدم الأسئلة للتحقق من الفهم
• اطلب المساعدة عند الحاجة
• استخدم المصادر الإضافية للتعمق أكثر

💡 **نصائح للعرض:**
• تحدث بوضوح وببطء
• استخدم الأمثلة التوضيحية
• شجع الأسئلة والمناقشة
• راجع النقاط الرئيسية في النهاية`;

    return {
      reply: presentation,
      videoLinks: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=9bZkp7q19f0'
      ],
      messageId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      confidence: 0.8
    };
  };

  return (
    <>
      {/* Smart Assistant Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-xl p-6 border border-slate-700 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
            🤖
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">💬 المساعد الذكي</h2>
            <p className="text-sm text-slate-300">Smart Study Assistant</p>
          </div>
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          تحدث مع المساعد الذكي للحصول على شرح مبسط للدروس، ملخصات، وروابط فيديوهات تعليمية مفيدة.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 ابدأ المحادثة
          </button>
          <button
            onClick={clearChat}
            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-300"
          >
            🗑️ مسح المحادثة
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold">المساعد الذكي</h3>
                  <p className="text-sm opacity-90">مرحباً {studentName}، كيف يمكنني مساعدتك؟</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Subject Selector */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اختر المادة الدراسية (اختياري):
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">اختر المادة</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Document Upload Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsDocumentUploadOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <span>📄</span>
                      <span>رفع مستند</span>
                    </button>
                    
                    <button
                      onClick={() => setIsSavedDocumentsOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                      <span>📁</span>
                      <span>الملفات المحفوظة</span>
                    </button>
                    
                    {uploadedDocument && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">✅ {uploadedDocument.file.name}</span>
                        <button
                          onClick={() => setUploadedDocument(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {uploadedDocument && (
                    <button
                      onClick={generatePresentation}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-300"
                    >
                      <span>🎯</span>
                      <span>إنشاء عرض تقديمي</span>
                    </button>
                  )}
                </div>

                {/* AI Mode Toggle */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={useSmartAI}
                      onChange={(e) => setUseSmartAI(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      استخدام الذكاء الاصطناعي الحقيقي
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-700">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <p className="text-lg">مرحباً! أنا المساعد الذكي</p>
                  <p className="text-sm mt-2">يمكنني مساعدتك في:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• شرح الدروس وتلخيصها</li>
                    <li>• اقتراح فيديوهات تعليمية</li>
                    <li>• الإجابة على الأسئلة الأكاديمية</li>
                    <li>• تقديم نصائح دراسية</li>
                  </ul>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.from === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-500'
                    }`}
                  >
                    <p className={`whitespace-pre-wrap ${message.from === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{message.text}</p>
                    
                    {/* Video Links */}
                    {message.videoLinks && message.videoLinks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-400">
                        <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">📺 فيديوهات تعليمية مقترحة:</p>
                        <div className="space-y-2">
                          {message.videoLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                              🎥 فيديو تعليمي #{index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-600 p-4 rounded-2xl border border-gray-200 dark:border-slate-500">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">المساعد يكتب...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? '⏳' : '📤'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {isDocumentUploadOpen && (
        <DocumentUpload
          onDocumentUpload={handleDocumentUpload}
          onClose={() => setIsDocumentUploadOpen(false)}
          studentId={studentId}
          studentName={studentName}
        />
      )}

      {/* Saved Documents Manager Modal */}
      {isSavedDocumentsOpen && (
        <SavedDocumentsManager
          studentId={studentId}
          studentName={studentName}
          onDocumentSelect={handleSavedDocumentSelect}
          onClose={() => setIsSavedDocumentsOpen(false)}
        />
      )}
    </>
  );
};

export default SmartAssistant;
