'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SliderItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface NewsItemData {
  id: string;
  title: string;
  content?: string;
  category: string;
}

const fallbackSliders: SliderItem[] = [
  { id: '1', title: 'بدء التحضير لمعرض التربية الفنية الابداعي', category: 'تعليم', imageUrl: '/images/slider/slide1.jpg' },
  { id: '2', title: 'روح التعاون والعمل كفريق', category: 'تعليم', imageUrl: '/images/slider/slide2.jpg' },
  { id: '3', title: 'يوم رياضي حافل بالنشاطات', category: 'فعاليات', imageUrl: '/images/slider/slide3.jpg' },
  { id: '4', title: 'دعم دائم ومستمر', category: 'تعليم', imageUrl: '/images/slider/slide4.jpg' },
];

const fallbackNews: NewsItemData[] = [
  { id: '1', title: 'افتتاح معرض العلوم السنوي', content: 'المعرض يضم العديد من التجارب العلمية المبتكرة', category: 'فعاليات' },
  { id: '2', title: 'نتائج المسابقة الرياضية', content: 'فاز فريق المدرسة بالمركز الأول', category: 'رياضة' },
  { id: '3', title: 'ورشة عمل للمعلمين', content: 'ورشة عمل حول طرق التدريس الحديثة', category: 'تدريب' },
  { id: '4', title: 'تكريم الطلاب المتفوقين', content: 'حفل تكريم الطلاب المتفوقين للعام الدراسي', category: 'تكريم' },
  { id: '5', title: 'رحلة علمية لمتحف العلوم', content: 'رحلة تعليمية مميزة لمتحف العلوم', category: 'رحلات' },
];

export default function Hero() {
  const [sliders, setSliders] = useState<SliderItem[]>(fallbackSliders);
  const [news, setNews] = useState<NewsItemData[]>(fallbackNews);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch('/api/slider');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSliders(data);
          }
        }
      } catch {
        // use fallback
      }
    };

    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNews(data);
          }
        }
      } catch {
        // use fallback
      }
    };

    fetchSliders();
    fetchNews();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  }, [sliders.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  }, [sliders.length]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="bg-gray-100 dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Slider - 3/4 width */}
          <div className="lg:w-3/4 w-full">
            <div className="relative rounded-xl overflow-hidden shadow-lg group" style={{ aspectRatio: '16/7' }}>
              {/* Slides */}
              {sliders.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/1200/500?random=${slide.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
                    <Badge className="bg-red-600 text-white mb-3 hover:bg-red-700">
                      {slide.category}
                    </Badge>
                    <h2 className="text-white text-xl md:text-3xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevSlide}
                aria-label="السابق"
              >
                <ChevronRight size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextSlide}
                aria-label="التالي"
              >
                <ChevronLeft size={24} />
              </Button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {sliders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-red-600 w-8'
                        : 'bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`الانتقال للشريحة ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* News Side Panel - 1/4 width */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full overflow-hidden dark-transition">
              <div className="bg-red-600 text-white px-4 py-3">
                <h3 className="font-bold text-lg">أحدث الأخبار</h3>
              </div>
              <div className="news-ticker-container h-[calc(100%-52px)] max-h-[400px] overflow-hidden p-3">
                <div className="animate-scroll-up">
                  {/* Duplicate news for seamless scrolling */}
                  {[...news, ...news].map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <Badge variant="outline" className="text-red-600 border-red-300 dark:border-red-600 dark:text-red-400 mb-2 text-xs">
                        {item.category}
                      </Badge>
                      <h4 className="text-sm font-semibold text-[#2A374E] dark:text-gray-200 leading-relaxed">
                        {item.title}
                      </h4>
                      {item.content && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
