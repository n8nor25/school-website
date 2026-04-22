'use client';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 dark-transition">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="lg:w-1/2 w-full animate-fade-in-up">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2 text-sm uppercase tracking-wide">
              مرحباً بكم
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A374E] dark:text-white mb-4 leading-tight">
              50 عاماً من الخبرة في التعليم
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              مدرسة الاحايوه شرق الاعدادية هي صرح تعليمي متميز يقع في قلب محافظة سوهاج. 
              تهدف المدرسة إلى تقديم تعليم عالي الجودة يجمع بين الأصالة والمعاصرة، 
              مع التركيز على تنمية المهارات والقدرات الإبداعية لدى الطلاب.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              نسعى دائماً لتوفير بيئة تعليمية محفزة تشجع على التفكير النقدي والإبداع، 
              من خلال معلمين أكفاء ومناهج تعليمية متطورة تتواكب مع أحدث المعايير العالمية.
            </p>

            {/* Vision Box */}
            <div className="border-2 border-red-600 dark:border-red-500 rounded-xl p-5 mb-6 bg-red-50/50 dark:bg-red-900/10">
              <h3 className="text-red-600 dark:text-red-400 font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full" />
                رؤية المدرسة
              </h3>
              <p className="text-[#2A374E] dark:text-gray-200 font-medium leading-relaxed">
                اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزة ومشاركة مجتمعية
              </p>
            </div>

            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base hover-lift transition-all">
              اعرف المزيد عنا
            </Button>
          </div>

          {/* Right Side - Video */}
          <div className="lg:w-1/2 w-full animate-fade-in-right">
            <div className="relative rounded-xl overflow-hidden shadow-2xl group">
              <video
                src="/videos/v1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
                poster="https://picsum.photos/800/450?random=about"
              >
                <source src="/videos/v1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-4">
                  <Play size={32} className="text-red-600 mr-[-2px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
