'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, BarChart3, MessageCircle, Puzzle, Pencil, ExternalLink, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServicesProps {
  onResultsClick?: () => void;
}

interface Schedule {
  id: string;
  title: string;
  grade: string;
  fileUrl: string;
  type: string;
  uploadDate: string;
  active: boolean;
}

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
    href: '#',
    isSchedule: true,
  },
  {
    icon: BarChart3,
    title: 'نتائج الطلاب',
    description: 'الاطلاع على النتائج والتقارير الأكاديمية للطلاب',
    action: 'عرض النتائج',
    href: '#',
    isResults: true,
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

const gradeColors: Record<string, string> = {
  'الأول الإعدادي': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'الثاني الإعدادي': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'الثالث الإعدادي': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'هيئة التدريس': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'عام': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

export default function Services({ onResultsClick }: ServicesProps) {
  const [showSchedules, setShowSchedules] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchedules(data.filter((s: Schedule) => s.type === 'حالي'));
      }
    } catch {
      // ignore
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (showSchedules) {
      fetchSchedules();
    }
  }, [showSchedules]);

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
                {service.isResults ? (
                  <Button
                    onClick={onResultsClick}
                    className="bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transition-all"
                  >
                    {service.action}
                  </Button>
                ) : service.isSchedule ? (
                  <Button
                    onClick={() => setShowSchedules(true)}
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

      {/* Schedule Modal */}
      {showSchedules && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSchedules(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-[#1a1a1a] dark:bg-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold">جداول الحصص</h3>
                  <p className="text-white/60 text-sm">الجداول الدراسية الحالية</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setShowSchedules(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {loadingSchedules ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-500">جاري تحميل الجداول...</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد جداول حالياً</p>
                  <p className="text-gray-400 text-sm mt-1">سيتم إضافة الجداول قريباً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {schedules.map((schedule) => (
                    <a
                      key={schedule.id}
                      href={schedule.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-lg transition-all border border-gray-100 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                          <FileText className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{schedule.title}</h4>
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${gradeColors[schedule.grade] || gradeColors['عام']}`}>
                            {schedule.grade}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{schedule.uploadDate}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500 flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
