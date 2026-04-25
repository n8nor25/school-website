'use client';

import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';

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
                <MessageCircle size={16} />
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  م.ش
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
