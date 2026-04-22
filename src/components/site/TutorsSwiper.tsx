'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tutors = [
  {
    id: 1,
    name: 'أ/ محمد عبدالرحمن',
    subject: 'اللغة العربية',
    email: 'mohamed@school.edu',
    image: '/images/tutor/tutor1.jpg',
  },
  {
    id: 2,
    name: 'أ/ فاطمة أحمد',
    subject: 'اللغة الإنجليزية',
    email: 'fatma@school.edu',
    image: '/images/tutor/tutor2.jpg',
  },
  {
    id: 3,
    name: 'أ/ علي حسن',
    subject: 'الرياضيات',
    email: 'ali@school.edu',
    image: '/images/tutor/tutor3.jpg',
  },
  {
    id: 4,
    name: 'أ/ سارة محمود',
    subject: 'العلوم',
    email: 'sara@school.edu',
    image: '/images/tutor/tutor4.jpg',
  },
  {
    id: 5,
    name: 'أ/ أحمد إبراهيم',
    subject: 'الدراسات الاجتماعية',
    email: 'ahmed@school.edu',
    image: '/images/tutor/tutor5.jpg',
  },
  {
    id: 6,
    name: 'أ/ نورا خالد',
    subject: 'الحاسب الآلي',
    email: 'noura@school.edu',
    image: '/images/tutor/tutor6.jpg',
  },
  {
    id: 7,
    name: 'أ/ حسام الدين',
    subject: 'التربية الدينية',
    email: 'hossam@school.edu',
    image: '/images/tutor/tutor7.jpg',
  },
  {
    id: 8,
    name: 'أ/ منى عبدالله',
    subject: 'التربية الفنية',
    email: 'mona@school.edu',
    image: '/images/tutor/tutor8.jpg',
  },
  {
    id: 9,
    name: 'أ/ خالد سعيد',
    subject: 'الرياضة',
    email: 'khaled@school.edu',
    image: '/images/tutor/tutor9.jpg',
  },
  {
    id: 10,
    name: 'أ/ هدى محمد',
    subject: 'اللغة الفرنسية',
    email: 'huda@school.edu',
    image: '/images/tutor/tutor10.jpg',
  },
];

function getInitialCardsToShow(): number {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

export default function TutorsSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(getInitialCardsToShow);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(4);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, tutors.length - cardsToShow);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    autoPlayRef.current = setInterval(next, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next]);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            مدرسونا الخبراء
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={prev}
            aria-label="السابق"
          >
            <ChevronRight size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={next}
            aria-label="التالي"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Cards */}
          <div className="overflow-hidden mx-6">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(${currentIndex * (100 / cardsToShow + 2)}%)`,
              }}
            >
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 12 / cardsToShow}px)` }}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover-lift transition-all duration-300 group text-center">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/300/250?random=tutor${tutor.id}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-[#2A374E] dark:text-white text-lg mb-1">
                        {tutor.name}
                      </h3>
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
                        {tutor.subject}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 flex items-center justify-center gap-1">
                        <Mail size={12} />
                        {tutor.email}
                      </p>

                      {/* Social Icons */}
                      <div className="flex items-center justify-center gap-2">
                        <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-600 hover:text-white transition-colors">
                          <Facebook size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-600 hover:text-white transition-colors">
                          <Twitter size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-600 hover:text-white transition-colors">
                          <Instagram size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`الانتقال ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
