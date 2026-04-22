import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, SunIcon, MoonIcon } from './Icons';
import { useAuth } from '../src/context/AuthContext';

type HeaderProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const formattedDateTime = new Intl.DateTimeFormat('ar-EG', options).format(now);
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime(); // Initial call
    const timerId = setInterval(updateDateTime, 1000 * 60); // Update every minute

    return () => clearInterval(timerId); // Cleanup on component unmount
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/', isLink: true },
    { name: 'عن المدرسة', href: '#about', isLink: false },
    { name: 'البرامج التعليمية', href: '#departments', isLink: false },
    { name: 'القبول والتسجيل', href: '#admission', isLink: false },
    { name: 'الحياة الطلابية', href: '/student-life-login', isLink: true },
    { name: 'اتصل بنا', href: '#contact', isLink: false },
  ];

  const handleNavClick = (link: any) => {
    if (link.isLink) {
      if (link.href === '/student-life-login') {
        if (user?.type === 'admin') {
          navigate('/admin-dashboard');
        } else if (user?.type === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/student-life-login');
        }
      } else {
        navigate(link.href);
      }
    } else {
      // Scroll to section
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    navigate('/');
    // Allow navigation to complete before clearing auth state
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 dark-transition animate-slideInFromTop">
      {/* Top Bar - Increased Height */}
      <div className="bg-[#f8f9fa] dark:bg-gray-700 border-b dark:border-gray-600 hidden md:block">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden sm:inline">{currentDateTime}</span>
          </div>
          {/* Centered Social Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <a href="#" className="hover:text-red-600 dark:hover:text-red-500 hover-scale transition-all duration-300"><Facebook className="w-4 h-4 md:w-5 md:h-5" /></a>
            <a href="#" className="hover:text-red-600 dark:hover:text-red-500 hover-scale transition-all duration-300"><Twitter className="w-4 h-4 md:w-5 md:h-5" /></a>
            <a href="#" className="hover:text-red-600 dark:hover:text-red-500 hover-scale transition-all duration-300"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
            <a href="#" className="hover:text-red-600 dark:hover:text-red-500 hover-scale transition-all duration-300"><Youtube className="w-4 h-4 md:w-5 md:h-5" /></a>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.type === 'student' ? '🎓' : '👑'}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs md:text-sm font-bold bg-red-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md hover:bg-red-700 hover-lift transition-all duration-300"
                >
                  تسجيل الخروج
                </button>
              </>
            )}
            <div className="relative hidden sm:block">
              <input type="text" placeholder="البحث..." className="border rounded-md py-1 px-2 pr-8 text-xs md:text-sm bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button onClick={toggleDarkMode} className="p-1 md:p-1.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 hover-scale transition-all duration-300">
              {isDarkMode ? <SunIcon className="w-3 h-3 md:w-4 md:h-4" /> : <MoonIcon className="w-3 h-3 md:w-4 md:h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header - Increased Height with Vision Box */}
      <div className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 hover-scale transition-all duration-300">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-red-600">مدرسة الاحايوه شرق</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">المرحلة الاعدادية</p>
          </div>
        </Link>

        {/* School Vision Box */}
        <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-2 border-blue-200 dark:border-blue-500 rounded-lg px-6 py-3 shadow-md">
          <h3 className="text-base font-bold text-blue-800 dark:text-blue-300 mb-1">رؤية المدرسة</h3>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزه ومشاركة مجتمعية
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#2A374E] dark:bg-gray-900 text-white overflow-x-auto">
        <div className="container mx-auto px-4">
          <ul className="flex items-center whitespace-nowrap">
            {navLinks.map((link, index) => (
              <li key={link.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <button
                  onClick={() => handleNavClick(link)}
                  className="block py-2 md:py-3 px-2 md:px-4 hover:bg-red-600 hover-lift transition-all duration-300 font-bold text-xs md:text-sm w-full text-right"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;