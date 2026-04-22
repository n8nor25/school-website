'use client';

import { BookOpen, Calendar, BarChart3, MessageCircle, Puzzle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: BookOpen,
    title: 'المكتبة الرقمية',
    description: 'الوصول إلى آلاف الكتب والمراجع التعليمية بشكل إلكتروني',
    action: 'تصفح المكتبة',
    href: '#',
  },
  {
    icon: Calendar,
    title: 'جدول الحصص',
    description: 'عرض وتحميل الجداول الدراسية لجميع المراحل',
    action: 'عرض الجداول',
    href: '#schedule-section',
    isSchedule: true,
  },
  {
    icon: BarChart3,
    title: 'نتائج الطلاب',
    description: 'الاطلاع على النتائج والتقارير الأكاديمية للطلاب',
    action: 'عرض النتائج',
    href: '#',
  },
  {
    icon: MessageCircle,
    title: 'شكاوى ومقترحات',
    description: 'تقديم شكوى أو مقترح لإدارة المدرسة',
    action: 'أرسل رسالة',
    href: '#contact',
  },
  {
    icon: Puzzle,
    title: 'أنشطة لا صفية',
    description: 'التعرف على الأنشطة والبرامج اللاصفية المتاحة',
    action: 'اكتشف الأنشطة',
    href: '#',
  },
  {
    icon: Pencil,
    title: 'التسجيل الإلكتروني',
    description: 'تسجيل الطلاب الجدد بشكل إلكتروني وسهل',
    action: 'سجل الآن',
    href: '#',
  },
];

export default function Services() {
  const handleScheduleClick = () => {
    const el = document.getElementById('schedule-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            الخدمات الإلكترونية
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover-lift transition-all duration-300 group border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors duration-300">
                  <IconComponent
                    size={28}
                    className="text-red-600 dark:text-red-400 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#2A374E] dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                {service.isSchedule ? (
                  <Button
                    onClick={handleScheduleClick}
                    className="bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transition-all"
                  >
                    {service.action}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all"
                    asChild
                  >
                    <a href={service.href}>{service.action}</a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
