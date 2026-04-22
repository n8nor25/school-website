import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h3 className="text-pink-500 dark:text-pink-400 font-bold text-lg mb-2 animate-fade-in-up">مرحبا بكم في عالم التعليم</h3>
            <h2 className="text-4xl font-black text-[#2A374E] dark:text-gray-100 mb-4 animate-fade-in-up animate-delay-200">50 عاماً من الخبرة في التعليم</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 animate-fade-in-up animate-delay-300">
              نحن على استعداد لبناء مستقبل أحلامك. نؤمن بأن التعليم هو حجر الأساس لمجتمع ناجح، ونسعى جاهدين لتقديم بيئة تعليمية محفزة ومبتكرة تمكن الطلاب من تحقيق إمكاناتهم الكاملة.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 animate-fade-in-up animate-delay-400">
              على مدار خمسة عقود، قمنا بتطوير مناهجنا وتحديث أساليبنا لنواكب التطورات العالمية، مع الحفاظ على قيمنا الأساسية المتمثلة في التميز والنزاهة والاحترام.
            </p>
            <div className="mt-8 mb-8 border-r-4 border-pink-500 dark:border-pink-400 pr-4 bg-gradient-to-r from-pink-50/50 to-transparent dark:from-pink-900/20 p-4 rounded-lg animate-fade-in-up animate-delay-500">
              <h4 className="font-bold text-lg text-[#2A374E] dark:text-gray-100 mb-2">رؤية المدرسة</h4>
              <p className="text-gray-600 dark:text-gray-300">
                اعداد جيل متميز خلقيا وعلميا بمعلم كفء وادارة مدرسية وبمشاركة مجتمعية
              </p>
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-8 rounded-full hover:from-pink-600 hover:to-pink-700 hover-lift transition-all duration-300 text-lg shadow-lg hover:shadow-xl">
              اعرف المزيد عنا
            </button>
          </div>
          <div className="relative animate-fade-in-right">
            <video
              src="/videos/v1.mp4"
              controls
              autoPlay
              muted
              loop
              className="rounded-lg shadow-2xl w-full hover-lift transition-all duration-500"
              poster="/images/video-poster.jpg"
            >
              متصفحك لا يدعم عرض الفيديو.
            </video>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg -z-10 animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-8 border-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 rounded-lg -z-10 animate-pulse-custom"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full -z-10 animate-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;