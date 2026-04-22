import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);

  useEffect(() => {
    // إنشاء جزيئات متحركة
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5
    }));
    setParticles(newParticles);

    // تحريك الجزيئات
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > window.innerHeight ? 0 : particle.y + particle.speed,
        x: particle.x + (Math.random() - 0.5) * 0.5
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* 404 Animation */}
          <div className="relative mb-12">
            <div className="text-[12rem] md:text-[16rem] font-black text-white/10 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl md:text-9xl animate-bounce">🚀</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 text-4xl animate-pulse">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-bounce">⭐</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse">✨</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-bounce">💫</div>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-400 to-transparent rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-pink-400 to-transparent rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                أوه! لقد ضعت في
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  الفضاء الرقمي
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
                يبدو أن هذه الصفحة غير موجودة في أكاديمية الشرق.<br />
                لكن لا تقلق، يمكننا مساعدتك في العودة إلى المسار الصحيح!
              </p>

              {/* Interactive Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="group bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="text-5xl mb-6 group-hover:animate-bounce">🎓</div>
                  <h3 className="text-2xl font-bold text-white mb-4">البرامج التعليمية</h3>
                  <p className="text-white/80 leading-relaxed">اكتشف برامجنا التعليمية المتنوعة والمتطورة</p>
                </div>
                
                <div className="group bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="text-5xl mb-6 group-hover:animate-bounce">🤖</div>
                  <h3 className="text-2xl font-bold text-white mb-4">المساعد الذكي</h3>
                  <p className="text-white/80 leading-relaxed">احصل على مساعدة ذكية في دراستك</p>
                </div>
                
                <div className="group bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="text-5xl mb-6 group-hover:animate-bounce">📚</div>
                  <h3 className="text-2xl font-bold text-white mb-4">المكتبة الرقمية</h3>
                  <p className="text-white/80 leading-relaxed">استكشف مواردنا التعليمية الغنية</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <button
                  onClick={handleGoHome}
                  className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span className="text-2xl">🏠</span>
                    <span>العودة للرئيسية</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>

                <button
                  onClick={handleGoBack}
                  className="group relative px-12 py-6 bg-white/20 text-white font-bold text-xl rounded-3xl border-2 border-white/30 hover:bg-white/30 transition-all duration-500 backdrop-blur-sm hover:scale-105"
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">⬅️</span>
                    <span>العودة للخلف</span>
                  </span>
                </button>
              </div>

              {/* Search Suggestions */}
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-3">
                  <span>🔍</span>
                  <span>هل تبحث عن شيء معين؟</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'البرامج', path: '/programs', icon: '🎓' },
                    { name: 'القبول', path: '/admissions', icon: '📝' },
                    { name: 'الحياة الطلابية', path: '/student-life', icon: '🎉' },
                    { name: 'اتصل بنا', path: '/contact', icon: '📞' }
                  ].map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => navigate(item.path)}
                      className="group px-6 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl group-hover:animate-bounce">{item.icon}</span>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-white/70 text-lg">
            <p className="mb-2">أكاديمية الشرق - منصة التعليم الرقمي المتطورة</p>
            <p>© 2024 جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundEnhanced;
