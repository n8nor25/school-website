'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mail, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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

const subjectColors: Record<string, string> = {
  'اللغة العربية': 'from-amber-500 to-orange-500',
  'اللغة الإنجليزية': 'from-blue-500 to-cyan-500',
  'الرياضيات': 'from-emerald-500 to-teal-500',
  'العلوم': 'from-purple-500 to-violet-500',
  'الدراسات الاجتماعية': 'from-rose-500 to-pink-500',
  'الحاسب الآلي': 'from-sky-500 to-blue-500',
  'التربية الدينية': 'from-yellow-500 to-amber-500',
  'التربية الفنية': 'from-fuchsia-500 to-purple-500',
  'الرياضة': 'from-green-500 to-emerald-500',
  'اللغة الفرنسية': 'from-indigo-500 to-blue-500',
};

function getCardsToShow(): number {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
}

export default function TutorsSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
      setCurrentIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, tutors.length - cardsToShow);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  }, [currentIndex, maxIndex, goTo]);

  const prev = useCallback(() => {
    goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  }, [currentIndex, maxIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(next, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, isHovered]);

  // Calculate slide percentage
  const slidePercent = 100 / cardsToShow;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#2A374E]/10 dark:bg-blue-900/20 rounded-full px-4 py-1.5 mb-4">
            <User className="w-4 h-4 text-[#2A374E] dark:text-blue-300" />
            <span className="text-sm font-medium text-[#2A374E] dark:text-blue-300">فريقنا التعليمي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            مدرسونا الخبراء
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            نخبة من المعلمين المتخصصين يكرسون جهودهم لرفعة طلابنا
          </p>
          <div className="w-20 h-1 bg-[#2A374E] dark:bg-blue-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-[#2A374E] hover:text-white hover:border-[#2A374E] dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all"
            onClick={prev}
            aria-label="السابق"
          >
            <ChevronRight size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full h-10 w-10 md:h-12 md:w-12 hover:bg-[#2A374E] hover:text-white hover:border-[#2A374E] dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all"
            onClick={next}
            aria-label="التالي"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-6 md:mx-10" ref={containerRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${currentIndex * slidePercent}%)`,
                gap: '1.5rem',
              }}
            >
              {tutors.map((tutor) => {
                const gradientClass = subjectColors[tutor.subject] || 'from-gray-500 to-gray-600';
                return (
                  <div
                    key={tutor.id}
                    className="flex-shrink-0"
                    style={{ width: `calc(${slidePercent}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)` }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
                      {/* Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        <Image
                          src={tutor.image}
                          alt={tutor.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={tutor.id <= 4}
                        />
                        {/* Gradient overlay at bottom of image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        {/* Subject badge on image */}
                        <div className={`absolute top-3 right-3 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                          {tutor.subject}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 text-center">
                        <h3 className="font-bold text-[#2A374E] dark:text-white text-lg mb-1">
                          {tutor.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-2">
                          <BookOpen size={12} />
                          <span>{tutor.subject}</span>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-xs flex items-center justify-center gap-1">
                          <Mail size={11} />
                          {tutor.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-[#2A374E] dark:bg-blue-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`الانتقال إلى المجموعة ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
