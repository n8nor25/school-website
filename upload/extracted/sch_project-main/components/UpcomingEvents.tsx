import React from 'react';
import { Calendar, Clock, LocationMarker } from './Icons';

const events = [
  {
    title: 'ساعة حاسمة',
    description: 'ورشة عمل حول إدارة الوقت والاستعداد للاختبارات النهائية.',
    date: '10 نوفمبر 2024',
    time: '2:30م - 5:30م',
    location: 'القاعة الكبرى',
    image: 'https://picsum.photos/seed/upcoming1/400/300'
  },
  {
    title: 'التصميم الإبداعي',
    description: 'مسابقة في التصميم الجرافيكي لعرض مواهب الطلاب.',
    date: '10 نوفمبر 2024',
    time: '2:30م - 5:30م',
    location: 'معمل الحاسب الآلي',
    image: 'https://picsum.photos/seed/upcoming2/400/300'
  },
  {
    title: 'القيادة الأفضل',
    description: 'ندوة عن مهارات القيادة يقدمها خبراء في المجال.',
    date: '10 نوفمبر 2024',
    time: '2:30م - 5:30م',
    location: 'المسرح المدرسي',
    image: 'https://picsum.photos/seed/upcoming3/400/300'
  },
];

const UpcomingEvents: React.FC = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
            <div className="inline-block bg-pink-100 text-pink-500 dark:bg-pink-900/50 dark:text-pink-400 p-3 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015.292-2.121C11.144 3.753 12 4.935 12 6.25c0 1.954-1.546 3.5-3.5 3.5S5 8.204 5 6.25V5zm5.292-2.121A3.001 3.001 0 0115 5v1.25c0 1.954 1.546 3.5 3.5 3.5s3.5-1.546 3.5-3.5V5a3 3 0 00-5.292-2.121C15.856 3.753 15 4.935 15 6.25c0-1.315-.856-2.497-1.708-3.371zM3.5 11.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM15 11.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" clipRule="evenodd" /></svg>
            </div>
          <h2 className="text-3xl font-bold text-[#2A374E] dark:text-gray-100">الفعاليات القادمة</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            انضم إلينا في فعالياتنا القادمة المصممة لإثراء تجربة طلابنا التعليمية والاجتماعية.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 ml-1 text-pink-500 dark:text-pink-400" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 h-16">{event.description}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                    <div className="flex items-center"><Clock className="w-4 h-4 ml-2 text-pink-500 dark:text-pink-400" />{event.time}</div>
                    <div className="flex items-center"><LocationMarker className="w-4 h-4 ml-2 text-pink-500 dark:text-pink-400" />{event.location}</div>
                </div>
                <a href="#" className="font-bold text-pink-500 border border-pink-500 rounded-full px-6 py-2 hover:bg-pink-500 hover:text-white transition-colors duration-300 dark:text-pink-400 dark:border-pink-400 dark:hover:bg-pink-400 dark:hover:text-gray-900">
                  اقرأ المزيد
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;