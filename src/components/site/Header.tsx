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
  { label: 'الحياة المدرسية', href: 'student-life', isStudentLife: true },
  { label: 'التواصل', href: '#contact' },
];

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export default function Header({ onAdminClick, isLoggedIn, onLogout, onStudentLifeClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(getInitialDarkMode);
  const [currentDate, setCurrentDate] = useState('');
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
      setCurrentDate(
        now.toLocaleDateString('ar-EG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setCurrentTime(
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
      {/* Top Bar - Red Background with Date/Time on 2 lines */}
      <div className="bg-red-600 dark:bg-red-700 text-white py-1.5 text-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date & Time on 2 lines */}
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-white font-medium text-xs">{currentDate}</span>
              <span className="text-white/80 text-xs">{currentTime}</span>
            </div>
            {/* Social Icons - Centered */}
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Twitter">
                <Twitter size={15} />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Youtube">
                <Youtube size={15} />
              </a>
              <a href="https://wa.me/200931234567" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition-colors" aria-label="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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

      {/* Navigation Bar - BLACK background */}
      <nav className="bg-[#1a1a1a] dark:bg-black shadow-md dark-transition">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.isStudentLife ? (
                    <button
                      onClick={onStudentLifeClick}
                      className="block px-4 py-2 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded transition-colors text-sm font-bold bg-red-600/20"
                    >
                      🎓 {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="block px-4 py-2 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded transition-colors text-sm font-medium"
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
              className="md:hidden text-white hover:bg-red-600"
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
                        className="block w-full text-right px-4 py-2 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded transition-colors text-sm font-bold bg-red-600/20"
                      >
                        🎓 {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="block px-4 py-2 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded transition-colors text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              {/* Mobile Vision */}
              <div className="mt-3 bg-red-600 dark:bg-red-700 rounded-lg p-3 mx-2">
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
