import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChartBar, Chat, Puzzle, Pencil } from './Icons';

const services = [
  {
    title: 'نظام إدارة التعلم',
    description: 'الوصول إلى المواد والواجبات',
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
  },
  {
    title: 'جدول الحصص',
    description: 'مواعيد الحصص والاختبارات',
    icon: <Calendar className="w-12 h-12 text-green-500" />,
  },
  {
    title: 'الدرجات والتقييم',
    description: 'متابعة درجات الطلبة وتقييماتهم',
    icon: <ChartBar className="w-12 h-12 text-yellow-500" />,
  },
  {
    title: 'التواصل مع المعلمين',
    description: 'منصة التواصل المباشر',
    icon: <Chat className="w-12 h-12 text-purple-500" />,
  },
  {
    title: 'الأنشطة والفعاليات',
    description: 'التسجيل في الأنشطة المدرسية',
    icon: <Puzzle className="w-12 h-12 text-red-500" />,
  },
  {
    title: 'المكتبة الرقمية',
    description: 'مصادر تعليمية وكتب إلكترونية',
    icon: <Pencil className="w-12 h-12 text-indigo-500" />,
  },
];

const Services: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceTitle: string) => {
    console.log(`Service clicked: ${serviceTitle}`);
    
    if (serviceTitle === 'جدول الحصص') {
      console.log('Navigating to /schedule');
      try {
        navigate('/schedule');
        console.log('Navigation successful');
      } catch (error) {
        console.error('Navigation error:', error);
        // محاولة بديلة
        window.location.href = '/schedule';
      }
    } else {
      // يمكن إضافة روابط أخرى للخدمات الأخرى لاحقاً
      alert(`خدمة "${serviceTitle}" قيد التطوير. سيتم إضافتها قريباً!`);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark-transition">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-[#2A374E] dark:text-gray-100">الخدمات الإلكترونية</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">وصول سريع للخدمات التعليمية المختلفة</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-start gap-6 hover-lift transition-all duration-500 group animate-fade-in-up cursor-pointer" 
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => handleServiceClick(service.title)}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{service.description}</p>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleServiceClick(service.title);
                  }}
                  className={`text-sm font-bold px-4 py-2 rounded-lg transition-all duration-300 inline-block cursor-pointer ${
                    service.title === 'جدول الحصص' 
                      ? 'bg-green-500 text-white hover:bg-green-600 hover-scale shadow-md' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {service.title === 'جدول الحصص' ? '🎯 الدخول للخدمة' : '⏳ قريباً'}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;