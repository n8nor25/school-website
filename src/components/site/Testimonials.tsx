'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'ولي أمر',
    avatar: 'https://i.pravatar.cc/100?img=1',
    quote: 'مدرسة ممتازة تهتم بتعليم الطلاب وتنمية مهاراتهم. أبنائي حققوا نتائج رائعة بفضل المعلمين الأكفاء والإدارة المتميزة.',
  },
  {
    id: 2,
    name: 'فاطمة علي',
    role: 'معلمة سابقة',
    avatar: 'https://i.pravatar.cc/100?img=5',
    quote: 'عملت في هذه المدرسة لسنوات وأشهد على التزامها بالجودة التعليمية والبيئة المحفزة للطلاب والمعلمين على حد سواء.',
  },
  {
    id: 3,
    name: 'محمد حسن',
    role: 'طالب سابق',
    avatar: 'https://i.pravatar.cc/100?img=12',
    quote: 'أنا ممتن جداً لهذه المدرسة التي ساعدتني في بناء مستقبلي. التعليم الذي تلقيته كان أساس نجاحي في المراحل التالية.',
  },
  {
    id: 4,
    name: 'نورا عبدالله',
    role: 'ولية أمر',
    avatar: 'https://i.pravatar.cc/100?img=9',
    quote: 'أنصح جميع الآباء بتسجيل أبنائهم في هذه المدرسة. الرعاية والاهتمام بالطلاب لا مثيل لهما.',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            قالوا عن المدرسة
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-3xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 text-center">
                    {/* Quote Icon */}
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Quote size={24} className="text-red-600 dark:text-red-400" />
                    </div>

                    {/* Quote Text */}
                    <p className="text-gray-600 dark:text-gray-200 leading-relaxed text-lg mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-red-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/100/100?random=testimonial${testimonial.id}`;
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-[#2A374E] dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={prev}
            aria-label="السابق"
          >
            <ChevronRight size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={next}
            aria-label="التالي"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`الانتقال للشهادة ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
