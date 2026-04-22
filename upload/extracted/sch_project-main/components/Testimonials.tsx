import React, { useState } from 'react';

const testimonials = [
  {
    quote: "تجربتي في مدرسة  كانت رائعة. المدرسون كانوا داعمين جداً والبيئة التعليمية محفزة، مما ساعدني على تحقيق أفضل إمكانياتي.",
    name: "نوووور أحمد",
    role: "طالبة في قسم الهندسة",
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    quote: "تعلمت الكثير ليس فقط على المستوى الأكاديمي ولكن أيضاً على المستوى الشخصي. الأنشطة اللاصفية كانت ممتعة ومفيدة بشكل لا يصدق.",
    name: "محمد علي",
    role: "طالب في قسم الاقتصاد",
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    quote: "البنية التحتية والمرافق هنا على أعلى مستوى. المختبرات والمكتبة مجهزة تجهيزاً كاملاً، مما يسهل عملية التعلم والبحث.",
    name: "فاطمة الزهراء",
    role: "طالبة في قسم العلوم",
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    quote: "أنا ممتن للفرص التي أتيحت لي هنا. من خلال المشاريع والتدريب العملي، اكتسبت خبرة عملية قيمة ستساعدني في مسيرتي المهنية.",
    name: "خالد إبراهيم",
    role: "طالب في قسم تكنولوجيا المعلومات",
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
];


const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevTestimonial = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextTestimonial = () => {
        const isLastSlide = currentIndex === testimonials.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-500 dark:bg-blue-900/50 dark:text-blue-400 p-3 rounded-full mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
            </div>
          <h2 className="text-3xl font-bold text-[#2A374E] dark:text-gray-100">قالوا عن المدرسة</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            آراء طلابنا هي شهادة على جودة التعليم والبيئة الداعمة التي نقدمها.
          </p>
        </div>
        
        <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden relative h-72">
                 {testimonials.map((testimonial, index) => (
                    <div key={index} className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-sm text-center h-full flex flex-col justify-center">
                            <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mx-auto -mt-16 mb-4 border-4 border-white dark:border-gray-800" />
                            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">"{testimonial.quote}"</p>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                                <p className="text-blue-500 dark:text-blue-400 text-sm">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 bg-white dark:bg-gray-700 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600 z-10 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 bg-white dark:bg-gray-700 rounded-full shadow-md p-2 hover:bg-gray-100 dark:hover:bg-gray-600 z-10 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;