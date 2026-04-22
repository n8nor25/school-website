import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: '/images/slider/slide1.jpg',
    category: 'تعليم',
    title: ' بدء التحضير لمعرض التربية الفنية الابداعى ',
  },
  {
    image: '/images/slider/slide2.jpg',
    category: 'تعليم',
    title: '    روح التعاون والعمل كفريق   ',
  },
  {
    image: '/images/slider/slide3.jpg',
    category: 'فعاليات',
    title: 'يوم رياضي حافل بالنشاطات لجميع الطلاب',
  },
  {
    image: '/images/slider/slide4.jpg',
    category: 'تعليم',
    title: ' دعم دائم ومستمر ',
  },
  {
    image: '/images/slider/slide5.jpg',
    category: 'فعاليات',
    title: ' تشجيع وفعاليات تواكب الاحداث',
  },
  {
    image: '/images/slider/slide6.jpg',
    category: 'تعليم',
    title: 'جوانب  مضيئة ',
  },
  {
    image: '/images/slider/slide7.jpg',
    category: 'تعليم',
    title: 'نحو غد مشرق',
  },
  {
    image: '/images/slider/slide8.jpg',
    category: 'تعليم',
    title: 'جوانب من المسيرة',
  },
  {
    image: '/images/slider/slide9.jpg',
    category: 'تعليم',
    title: 'جوانب من مسيرة المدرسه ',
  },
  {
    image: '/images/slider/slide10.jpg',
    category: 'تعليم',
    title: 'جوانب من مسيرة المدرسه ',
  },
];

const latestNews = [
  '  زيارة فريق الجودة للمدرسة قريبا',
  'افتتاح معرض أهلاً مدارس بأرض المعارض الدولي للكتاب',
  'قرب بدء الامتحان الاول',
  'والاستعداد لتدشين موقع مدرسة الاحايوه شرق الاعدادية لخدمة الطالب والمعلم وولى',

];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="container mx-auto pt-2 md:pt-4 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 animate-fade-in-up">
        {/* Main Slider */}
        <div
          className="lg:col-span-3 relative aspect-video overflow-hidden group rounded-md hover-lift transition-all duration-500"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-0 right-0 p-3 md:p-6 text-white animate-fade-in-up">
                <span className="bg-red-600 px-2 md:px-3 py-1 text-xs md:text-sm font-bold hover-glow transition-all duration-300">{slide.category}</span>
                <h2 className="text-lg md:text-3xl font-black mt-2 max-w-lg line-clamp-2 md:line-clamp-none hover-scale transition-all duration-300">{slide.title}</h2>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
            }}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/70 hover-scale transition-all duration-300 z-10 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
            }}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/70 hover-scale transition-all duration-300 z-10 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlide(index);
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Side Panel - Latest News */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col h-full group hover-lift transition-all duration-300 animate-fade-in-right">
          <h3 className="text-center bg-red-600 text-white font-bold py-2 md:py-3 text-sm md:text-lg rounded-t-md shrink-0">أحدث الأخبار</h3>
          <div
            className="p-2 md:p-4 flex-grow overflow-hidden relative news-ticker-container cursor-pointer"
            onMouseEnter={() => {
              // إيقاف الحركة عند التأشير
              const element = document.querySelector('.animate-scroll-up') as HTMLElement;
              if (element) {
                element.style.animationPlayState = 'paused';
              }
            }}
            onMouseLeave={() => {
              // استئناف الحركة عند إزالة التأشير
              const element = document.querySelector('.animate-scroll-up') as HTMLElement;
              if (element) {
                element.style.animationPlayState = 'running';
              }
            }}
          >
            <div className="animate-scroll-up">
              {/* Duplicating for seamless scroll */}
              {[...latestNews, ...latestNews].map((news, index) => (
                <div
                  key={index}
                  className="news-item flex items-start gap-2 md:gap-3 group/item mb-4 md:mb-6 hover-lift transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    // يمكن إضافة وظيفة النقر هنا لاحقاً
                    console.log('News clicked:', news);
                  }}
                >
                  <span className="text-red-500 mt-1 md:mt-2 text-xs animate-pulse-custom">●</span>
                  <span className="text-xs md:text-base font-bold leading-relaxed text-gray-800 dark:text-gray-200 group-hover/item:text-red-600 dark:group-hover/item:text-red-500 transition-all duration-300 border-b border-gray-200 dark:border-gray-600 pb-2 md:pb-3 flex-1">
                    {news}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;