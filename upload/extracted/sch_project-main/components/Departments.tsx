import React, { useState, useEffect } from 'react';

const departments = [
  { name: 'Education', image: 'https://picsum.photos/seed/dept1/400/300' },
  { name: 'Economy', image: 'https://picsum.photos/seed/dept2/400/300' },
  { name: 'Humanities', image: 'https://picsum.photos/seed/dept3/400/300' },
  { name: 'Social Sciences', image: 'https://picsum.photos/seed/dept4/400/300' },
  { name: 'Engineering', image: 'https://picsum.photos/seed/dept5/400/300' },
  { name: 'Medicine', image: 'https://picsum.photos/seed/dept6/400/300' },
];

const Departments: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // حركة تلقائية بطيئة
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % departments.length);
    }, 4000); // تغيير كل 4 ثوان

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const prev = () => {
    setIsAutoPlay(false);
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : departments.length - 1);
  };

  const next = () => {
    setIsAutoPlay(false);
    setCurrentIndex((currentIndex + 1) % departments.length);
  };

  // استئناف الحركة التلقائية بعد 5 ثوان من آخر تفاعل يدوي
  useEffect(() => {
    if (isAutoPlay) return;

    const timer = setTimeout(() => {
      setIsAutoPlay(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlay]);

  return (
    <section id="departments" className="py-12 bg-white dark:bg-gray-800 dark-transition">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A374E] dark:text-gray-100 animate-fade-in-up">الأقسام التعليمية</h2>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(${currentIndex * -16.666}%)` }}>
            {departments.map((dept, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative rounded-lg overflow-hidden h-64 group hover-lift transition-all duration-500">
                  <img src={dept.image} alt={dept.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">{dept.name}</h3>
                  </div>
                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover-scale transition-all duration-300 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover-scale transition-all duration-300 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
};

export default Departments;