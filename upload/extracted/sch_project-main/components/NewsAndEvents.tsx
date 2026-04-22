import React from 'react';

const newsItems = [
  {
    title: 'بطولة كرة القدم بين الفصول',
    category: 'رياضة',
    date: '20 يونيو 2024',
    description: 'منافسات قوية وروح رياضية عالية.',
    image: '/images/events/event1.jpg'
  },
  {
    title: 'معرض العلوم والتكنولوجيا السنوي',
    category: 'ثقافة',
    date: '9 يونيو 2024',
    description: 'مشاريع مبتكرة لطلابنا في مجالات متعددة.',
    image: '/images/events/event2.jpg'
  },
  {
    title: 'تكريم الطالب المتفوق في الفصل الأول',
    category: 'نشاطات',
    date: '15 مايو 2024',
    description: 'حفل تكريم للطلبة المتفوقين بحضور الهيئة التعليمية.',
    image: '/images/events/event3.jpg'
  },
  {
    title: 'برامج العطلة الصيفية',
    category: 'أنشطة',
    date: '10 يونيو 2024',
    description: 'ورش عمل ودورات مهارية متنوعة.',
    image: '/images/events/event4.jpg'
  },
  {
    title: 'ورش عمل وتدريب',
    category: 'تكنولوجيا',
    date: '1 يونيو 2024',
    description: 'تجارب عملية وتطبيقات متقدمة للمتفوقين.',
    image: '/images/events/event5.jpg'
  },
  {
    title: 'مبادرة الزراعة في الحديقة المدرسية',
    category: 'بيئة',
    date: '25 يونيو 2024',
    description: 'تعزيز الوعي البيئي لدى الطلبة.',
    image: '/images/events/event6.jpg'
  },
];

const NewsAndEvents: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-black/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A374E] dark:text-gray-100">أحدث الأخبار والفعاليات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{item.date}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                <a href="#" className="font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">اقرأ المزيد</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsAndEvents;