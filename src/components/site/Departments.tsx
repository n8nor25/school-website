'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const departments = [
  { id: 1, name: 'اللغة العربية', image: 'https://picsum.photos/400/300?random=dept1' },
  { id: 2, name: 'اللغة الإنجليزية', image: 'https://picsum.photos/400/300?random=dept2' },
  { id: 3, name: 'الرياضيات', image: 'https://picsum.photos/400/300?random=dept3' },
  { id: 4, name: 'العلوم', image: 'https://picsum.photos/400/300?random=dept4' },
  { id: 5, name: 'الدراسات الاجتماعية', image: 'https://picsum.photos/400/300?random=dept5' },
  { id: 6, name: 'الحاسب الآلي', image: 'https://picsum.photos/400/300?random=dept6' },
];

function getInitialCardsToShow(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

export default function Departments() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(getInitialCardsToShow);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, departments.length - cardsToShow);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(next, 4000);
  }, [next]);

  const handleInteraction = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(startAutoPlay, 5000);
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [startAutoPlay]);

  return (
    <section id="departments" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            الأقسام التعليمية
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={() => { prev(); handleInteraction(); }}
            aria-label="السابق"
          >
            <ChevronRight size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-full h-10 w-10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            onClick={() => { next(); handleInteraction(); }}
            aria-label="التالي"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-6">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(${currentIndex * (100 / cardsToShow + 2)}%)`,
              }}
            >
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 12 / cardsToShow}px)` }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer hover-scale transition-all duration-300 h-64">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 right-0 left-0 p-5">
                      <h3 className="text-white font-bold text-xl">{dept.name}</h3>
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
                onClick={() => { setCurrentIndex(i); handleInteraction(); }}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`الانتقال للقسم ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
