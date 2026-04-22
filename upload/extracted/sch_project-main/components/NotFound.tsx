import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-white opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🚀</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            أوه! لقد ضعت في الفضاء
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
            يبدو أن هذه الصفحة غير موجودة في مدرسة الاحايوه شرق.<br />
            لكن لا تقلق، يمكننا مساعدتك في العودة إلى المسار الصحيح!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-white mb-2">البرامج التعليمية</h3>
              <p className="text-white/70 text-sm">اكتشف برامجنا التعليمية المتنوعة</p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-white mb-2">المساعد الذكي</h3>
              <p className="text-white/70 text-sm">احصل على مساعدة في دراستك</p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">المكتبة الرقمية</h3>
              <p className="text-white/70 text-sm">استكشف مواردنا التعليمية</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoHome}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>🏠</span>
                <span>العودة للرئيسية</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleGoBack}
              className="group relative px-8 py-4 bg-white/20 text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center space-x-2">
                <span>⬅️</span>
                <span>العودة للخلف</span>
              </span>
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              🔍 هل تبحث عن شيء معين؟
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={() => navigate('/programs')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 text-sm"
              >
                البرامج
              </button>
              <button 
                onClick={() => navigate('/admissions')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 text-sm"
              >
                القبول
              </button>
              <button 
                onClick={() => navigate('/student-life')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 text-sm"
              >
                الحياة الطلابية
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 text-sm"
              >
                اتصل بنا
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-400/20 rounded-full animate-bounce"></div>

        {/* Footer */}
        <div className="mt-8 text-white/60 text-sm">
          <p>مدرسة الاحايوه شرق - منصة التعليم الرقمي المتطورة</p>
          <p className="mt-2">© 2024 جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
