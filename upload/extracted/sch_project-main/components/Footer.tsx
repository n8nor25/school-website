import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2A374E] dark:bg-gray-900 text-white pt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About School */}
          <div>
            <h3 className="text-xl font-bold mb-4">مدرسة الاحايوه شرق ع</h3>
            <p className="text-gray-400 leading-relaxed">
              مؤسسة تعليمية رائدة تهدف إلى بناء جيل مبدع ومفكر، قادر على مواجهة تحديات المستقبل.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook className="w-6 h-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-6 h-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram className="w-6 h-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube className="w-6 h-6"/></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">الرئيسية</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">عن المدرسة</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">البرامج التعليمية</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">الأنشطة</a></li>
            </ul>
          </div>
          {/* E-Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">الخدمات الإلكترونية</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">نظام إدارة التعلم</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">جدول الحصص</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">الدرجات والتقييم</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:mr-2 transition-all">المكتبة الرقمية</a></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">معلومات التواصل</h3>
            <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                    <span className="mt-1 ml-3 text-white">📍</span>
                    <span>سوهاج، اخميم، الاحايوه شرق</span>
                </li>
                <li className="flex items-center">
                    <span className="ml-3 text-white">📞</span>
                    <span>3333 222 111 20+</span>
                </li>
                 <li className="flex items-center">
                    <span className="ml-3 text-white">📧</span>
                    <span>info@al-sharq-school.edu</span>
                </li>
                <li className="flex items-center">
                    <span className="ml-3 text-white">🎨</span>
                    <span>تصميم محروس شعبان</span>
                </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} مدرسة الاحايوه. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;