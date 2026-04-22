import React, { useState } from 'react';

interface WhatsAppGroup {
  id: string;
  name: string;
  phoneNumber: string;
  description: string;
}

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<WhatsAppGroup | null>(null);

  // قائمة الجروبات - يمكنك إضافة أرقام الواتس الفعلية
  const whatsappGroups: WhatsAppGroup[] = [
    {
      id: '1',
      name: 'دعم الطلاب',
      phoneNumber: '966501234567', // استبدل برقم الواتس الفعلي
      description: 'للإجابة على استفسارات الطلاب',
    },
    {
      id: '2',
      name: 'الأخبار والإعلانات',
      phoneNumber: '966501234568',
      description: 'أحدث الأخبار والفعاليات',
    },
    {
      id: '3',
      name: 'الدعم الأكاديمي',
      phoneNumber: '966501234569',
      description: 'للاستفسارات التعليمية',
    },
    {
      id: '4',
      name: 'المشاريع والواجبات',
      phoneNumber: '966501234570',
      description: 'متابعة المشاريع والواجبات',
    },
  ];

  const openWhatsApp = (group: WhatsAppGroup) => {
    // رابط الواتس اب للجروب
    const whatsappUrl = `https://wa.me/${group.phoneNumber}?text=مرحباً، أنا من أكاديمية الشرق`;
    window.open(whatsappUrl, '_blank');
  };

  const openDirectChat = () => {
    // فتح الواتس اب مباشرة بدون جروب
    const phoneNumber = '966501234567'; // رقم الدعم الرئيسي
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=مرحباً، أنا من أكاديمية الشرق`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* زر الواتس اب */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-float ${
          isOpen
            ? 'bg-red-600 dark:bg-red-700 animate-glow'
            : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 hover-glow'
        }`}
        title="تواصل معنا عبر الواتس اب"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.289-3.795 6.233-1.976 9.038 1.819 2.804 5.061 3.514 8.313 3.514.5 0 .988-.023 1.465-.07 1.512-.213 2.913-.6 4.035-1.268 1.122-.668 1.941-1.574 2.354-2.567.413-.993.62-2.095.62-3.181 0-3.344-2.186-6.377-5.511-7.678-1.547-.649-3.291-.956-5.157-.956z" />
          </svg>
        )}
      </button>

      {/* نافذة الواتس اب */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* رأس النافذة */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 p-4 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.289-3.795 6.233-1.976 9.038 1.819 2.804 5.061 3.514 8.313 3.514.5 0 .988-.023 1.465-.07 1.512-.213 2.913-.6 4.035-1.268 1.122-.668 1.941-1.574 2.354-2.567.413-.993.62-2.095.62-3.181 0-3.344-2.186-6.377-5.511-7.678-1.547-.649-3.291-.956-5.157-.956z" />
              </svg>
              واتس اب
            </h3>
            <p className="text-sm text-green-100">اختر جروب للتواصل معنا</p>
          </div>

          {/* قائمة الجروبات */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {/* خيار الدردشة المباشرة */}
            <button
              onClick={openDirectChat}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 hover-lift transition-all duration-300 text-right animate-fade-in-up"
            >
              <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                💬 دردشة مباشرة
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تحدث معنا مباشرة
              </p>
            </button>

            {/* قائمة الجروبات */}
            {whatsappGroups.map((group, index) => (
              <button
                key={group.id}
                onClick={() => openWhatsApp(group)}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 hover-lift transition-all duration-300 text-right border border-gray-200 dark:border-gray-700 animate-fade-in-up group"
                style={{animationDelay: `${(index + 1) * 0.1}s`}}
              >
                <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  👥 {group.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {group.description}
                </p>
              </button>
            ))}
          </div>

          {/* ملاحظة */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300">
            💡 سيتم فتح الواتس اب في نافذة جديدة
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;
