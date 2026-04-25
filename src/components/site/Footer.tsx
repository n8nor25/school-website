'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onResultsClick?: () => void;
}

const quickLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'عن المدرسة', href: '#about' },
  { label: 'الأقسام التعليمية', href: '#departments' },
  { label: 'التواصل', href: '#contact' },
];

export default function Footer({ onResultsClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const eServices = [
    { label: 'المكتبة الرقمية', href: '#', isResults: false },
    { label: 'نتائج الطلاب', href: '#', isResults: true },
    { label: 'شكاوى ومقترحات', href: '#contact', isResults: false },
    { label: 'التسجيل الإلكتروني', href: '#', isResults: false },
  ];

  return (
    <footer className="bg-[#2A374E] dark:bg-gray-950 text-white dark-transition">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">مدرسة الاحايوه شرق</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-4">
              مدرسة الاحايوه شرق الاعدادية - صرح تعليمي متميز يهدف إلى اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزة ومشاركة مجتمعية.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Youtube">
                <Youtube size={16} />
              </a>
              <a href="https://wa.me/200931234567" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* E-Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">الخدمات الإلكترونية</h3>
            <ul className="space-y-2">
              {eServices.map((link) => (
                <li key={link.label}>
                  {link.isResults && onResultsClick ? (
                    <button
                      onClick={onResultsClick}
                      className="text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Designer */}
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                سوهاج - مصر
              </li>
              <li className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                0931234567
              </li>
              <li className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                info@alhayahschool.edu.eg
              </li>
            </ul>
            {/* Designer Section */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shadow-lg flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dc7ysj5yq/image/upload/v1777145223/school-website/designer/zttkev3i4cace2yzko9n.png"
                    alt="محروس شعبان - المصمم والمطور"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-300 dark:text-gray-400 text-xs font-medium">
                    تصميم وتطوير
                  </p>
                  <p className="text-white dark:text-gray-200 text-sm font-bold">
                    محروس شعبان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Egyptian Flag Strip */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-black" />
      </div>

      {/* Copyright */}
      <div className="bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
            © {currentYear} مدرسة الاحايوه شرق - المرحلة الاعدادية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
