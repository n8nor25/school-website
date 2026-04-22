'use client';

import { useState, useEffect } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScheduleItem {
  id: string;
  title: string;
  grade: string;
  fileUrl: string;
  type: string;
  uploadDate: string;
}

const fallbackSchedules: ScheduleItem[] = [
  { id: '1', title: 'جدول الصف الأول', grade: 'الصف الأول', fileUrl: '#', type: 'حالي', uploadDate: '2025-01-15' },
  { id: '2', title: 'جدول الصف الثاني', grade: 'الصف الثاني', fileUrl: '#', type: 'حالي', uploadDate: '2025-01-15' },
  { id: '3', title: 'جدول الصف الثالث', grade: 'الصف الثالث', fileUrl: '#', type: 'حالي', uploadDate: '2025-01-15' },
  { id: '4', title: 'جدول الصف الأول - الفصل السابق', grade: 'الصف الأول', fileUrl: '#', type: 'سابق', uploadDate: '2024-09-01' },
  { id: '5', title: 'جدول الصف الثاني - الفصل السابق', grade: 'الصف الثاني', fileUrl: '#', type: 'سابق', uploadDate: '2024-09-01' },
  { id: '6', title: 'جدول الصف الثالث - الفصل السابق', grade: 'الصف الثالث', fileUrl: '#', type: 'سابق', uploadDate: '2024-09-01' },
];

const grades = ['الكل', 'الصف الأول', 'الصف الثاني', 'الصف الثالث'];

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(fallbackSchedules);
  const [activeGrade, setActiveGrade] = useState('الكل');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedules');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSchedules(data);
          }
        }
      } catch {
        // use fallback
      }
    };

    fetchSchedules();
  }, []);

  const filteredSchedules = activeGrade === 'الكل'
    ? schedules
    : schedules.filter((s) => s.grade === activeGrade);

  return (
    <section id="schedule-section" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-3">
            الجداول الدراسية
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {grades.map((grade) => (
            <Button
              key={grade}
              variant={activeGrade === grade ? 'default' : 'outline'}
              className={
                activeGrade === grade
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white'
              }
              onClick={() => setActiveGrade(grade)}
            >
              {grade}
            </Button>
          ))}
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover-lift transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FileText size={22} className="text-red-600 dark:text-red-400" />
                </div>
                <Badge
                  className={
                    schedule.type === 'حالي'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 border-0'
                  }
                >
                  {schedule.type}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-[#2A374E] dark:text-white mb-2">
                {schedule.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                المرحلة: {schedule.grade}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                تاريخ الرفع: {schedule.uploadDate}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all"
                >
                  <Eye size={14} className="ml-1" />
                  عرض
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Download size={14} className="ml-1" />
                  تحميل
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              لا توجد جداول لهذه المرحلة حالياً
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
