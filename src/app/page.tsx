'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import NewsAndEvents from '@/components/site/NewsAndEvents';
import Departments from '@/components/site/Departments';
import Services from '@/components/site/Services';
import PhotoGallery from '@/components/site/PhotoGallery';
import TutorsSwiper from '@/components/site/TutorsSwiper';
import Testimonials from '@/components/site/Testimonials';
import Contact from '@/components/site/Contact';
import ScheduleSection from '@/components/site/ScheduleSection';
import Footer from '@/components/site/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StudentLifePage from '@/components/site/StudentLifePage';
import ResultsPage from '@/components/site/ResultsPage';

interface AdminData {
  id: string;
  name: string;
  username: string;
}

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStudentLife, setShowStudentLife] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        return true;
      }
    }
    return false;
  });

  const [admin, setAdmin] = useState<AdminData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedAdmin = localStorage.getItem('alsharq_admin');
      if (savedAdmin) {
        try {
          return JSON.parse(savedAdmin);
        } catch {
          localStorage.removeItem('alsharq_admin');
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  }, []);

  const handleAdminLogin = (adminData: AdminData) => {
    setAdmin(adminData);
    localStorage.setItem('alsharq_admin', JSON.stringify(adminData));
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    setShowAdmin(false);
    localStorage.removeItem('alsharq_admin');
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
  };

  const handleStudentLifeClick = () => {
    setShowStudentLife(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromStudentLife = () => {
    setShowStudentLife(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultsClick = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromResults = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Results view
  if (showResults && !showAdmin) {
    return <ResultsPage onBack={handleBackFromResults} />;
  }

  // Student Life view
  if (showStudentLife && !showAdmin) {
    return <StudentLifePage onBack={handleBackFromStudentLife} />;
  }

  // Admin view
  if (showAdmin) {
    if (!admin) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <AdminLogin onLogin={handleAdminLogin} />
          <button
            onClick={() => setShowAdmin(false)}
            className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة للموقع
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminDashboard admin={admin} onLogout={handleAdminLogout} />
        <button
          onClick={() => setShowAdmin(false)}
          className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للموقع
        </button>
      </div>
    );
  }

  // Main site view
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0] dark:bg-gray-900 transition-colors duration-300">
      <Header
        onAdminClick={handleAdminClick}
        isLoggedIn={!!admin}
        onLogout={handleAdminLogout}
        onStudentLifeClick={handleStudentLifeClick}
        onResultsClick={handleResultsClick}
      />
      <main className="flex-1">
        <Hero />
        <About />
        <NewsAndEvents />
        <Departments />
        <Services onResultsClick={handleResultsClick} />
        <ScheduleSection />
        <PhotoGallery />
        <TutorsSwiper />
        <Testimonials />
        <Contact />
      </main>
      <Footer onResultsClick={handleResultsClick} />
    </div>
  );
}
