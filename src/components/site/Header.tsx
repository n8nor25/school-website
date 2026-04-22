'use client';

import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Sun, Moon, Search, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAdminClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onStudentLifeClick: () => void;
}

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'عن المدرسة', href: '#about' },
  { label: 'البرامج التعليمية', href: '#departments' },
  { label: 'جدول الحصص', href: '#schedule-section' },
  { label: 'الحياة الطلابية', href: 'student-life', isStudentLife: true },
  { label: 'اتصل بنا', href: '#contact' },
];

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export default function Header({ onAdminClick, isLoggedIn, onLogout, onStudentLifeClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(getInitialDarkMode);
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('ar-EG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
          ' | ' +
          now.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full dark-transition">
      {/* Top Bar */}
      <div className="bg-[#2A374E] text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-gray-300">{currentTime}</span>
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors" aria-label="Youtube">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
              aria-label="بحث"
            >
              <Search size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={toggleDarkMode}
              aria-label="تبديل الوضع"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 text-xs"
                onClick={onLogout}
              >
                <LogOut size={14} className="ml-1" />
                خروج
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 text-xs"
                onClick={onAdminClick}
              >
                <LogIn size={14} className="ml-1" />
                دخول
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-gray-800 py-4 shadow-sm dark-transition">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2A374E] dark:text-white">
                مدرسة الاحايوه شرق
              </h1>
              <p className="text-red-600 dark:text-red-400 font-medium text-sm md:text-base">
                المرحلة الاعدادية
              </p>
            </div>
          </div>

          {/* Vision Box - Desktop Only */}
          <div className="hidden lg:block max-w-sm">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
              <p className="text-[#2A374E] dark:text-gray-200 text-sm font-medium leading-relaxed">
                اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزة ومشاركة مجتمعية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-red-600 dark:bg-red-700 shadow-md dark-transition">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.isStudentLife ? (
                    <button
                      onClick={onStudentLifeClick}
                      className="block px-4 py-2 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded transition-colors text-sm font-bold bg-white/10"
                    >
                      🎓 {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="block px-4 py-2 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-red-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Mobile Vision */}
            <div className="md:hidden text-white text-xs truncate max-w-[200px]">
              رؤية المدرسة
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-slideInFromTop">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    {link.isStudentLife ? (
                      <button
                        onClick={() => { onStudentLifeClick(); setMobileMenuOpen(false); }}
                        className="block w-full text-right px-4 py-2 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded transition-colors text-sm font-bold bg-white/10"
                      >
                        🎓 {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="block px-4 py-2 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded transition-colors text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              {/* Mobile Vision */}
              <div className="mt-3 bg-red-700 dark:bg-red-800 rounded-lg p-3 mx-2">
                <p className="text-white text-xs leading-relaxed">
                  اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزة ومشاركة مجتمعية
                </p>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
