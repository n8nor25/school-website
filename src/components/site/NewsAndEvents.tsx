'use client';

import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft } from 'lucide-react';

const newsData = [
  {
    id: 1,
    title: 'افتتاح معرض العلوم السنوي',
    description: 'تقام المدرسة معرضها السنوي للعلوم بمشاركة أكثر من 50 طالب وطالبة بمشروعات مبتكرة.',
    date: '15 يناير 2025',
    category: 'فعاليات',
    image: '/images/events/event1.jpg',
  },
  {
    id: 2,
    title: 'فوز فريق المدرسة بالمسابقة الرياضية',
    description: 'حقق فريق المدرسة الرياضية المركز الأول على مستوى المحافظة في كرة القدم.',
    date: '20 يناير 2025',
    category: 'رياضة',
    image: '/images/events/event2.jpg',
  },
  {
    id: 3,
    title: 'ورشة عمل للمعلمين حول التعلم النشط',
    description: 'نظمت المدرسة ورشة عمل تدريبية للمعلمين حول استراتيجيات التعلم النشط.',
    date: '5 فبراير 2025',
    category: 'تدريب',
    image: '/images/events/event3.jpg',
  },
  {
    id: 4,
    title: 'تكريم الطلاب المتفوقين',
    description: 'أقامت المدرسة حفل تكريم للطلاب المتفوقين دراسياً في الفصل الدراسي الأول.',
    date: '10 فبراير 2025',
    category: 'تكريم',
    image: '/images/events/event4.jpg',
  },
  {
    id: 5,
    title: 'رحلة علمية لمتحف العلوم',
    description: 'نظمت المدرسة رحلة علمية لطلاب المرحلة الإعدادية لزيارة متحف العلوم.',
    date: '1 مارس 2025',
    category: 'رحلات',
    image: '/images/events/event5.jpg',
  },
  {
    id: 6,
    title: 'حملة تشجير المدرسة',
    description: 'نظمت المدرسة حملة تشجير بمشاركة الطلاب وأولياء الأمور والمعلمين.',
    date: '15 مارس 2025',
    category: 'بيئة',
    image: '/images/events/event6.jpg',
  },
];

export default function NewsAndEvents() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            أحدث الأخبار والفعاليات
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((item, index) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover-lift transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/400/250?random=${item.id}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <Badge className="absolute top-3 right-3 bg-red-600 text-white hover:bg-red-700">
                  {item.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm mb-3">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-[#2A374E] dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium text-sm hover:gap-2 transition-all"
                >
                  اقرأ المزيد
                  <ArrowLeft size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
