import React, { useState } from 'react';
import { aiServiceFactory } from '../services/ai-service-factory';

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

  const subjects = [
    'الرياضيات',
    'العلوم',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'التاريخ',
    'الجغرافيا',
    'الكمبيوتر',
    'الكيمياء',
    'الأحياء',
    'عام'
  ];

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
      // Use AI Service Factory
      const response = await aiServiceFactory.processMessage(
        inputMessage, 
        studentId, 
        selectedSubject || 'عام'
      );
      
      const botMessage = {
        id: response.messageId || (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: response.reply,
        timestamp: new Date(),
        videoLinks: response.videoLinks || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        from: 'bot' as const,
        text: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-700">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <p className="text-lg">مرحباً! أنا المساعد الذكي لأكاديمية الشرق</p>
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
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    
                    {/* Video Links */}
                    {message.videoLinks && message.videoLinks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-400">
                        <p className="text-sm font-medium mb-2">📺 فيديوهات تعليمية مقترحة:</p>
                        <div className="space-y-2">
                          {message.videoLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
    </>
  );
};

export default SmartAssistant;
