import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { AssignmentProvider } from './src/context/AssignmentContext';
import ProtectedRoute from './src/components/ProtectedRoute';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsAndEvents from './components/NewsAndEvents';
import Departments from './components/Departments';
import Services from './components/Services';
import PhotoGallery from './components/PhotoGallery';
import TutorsSwiper from './components/TutorsSwiper';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import StudentLifeLogin from './pages/StudentLifeLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Schedule from './pages/Schedule';
import NotFound from './components/NotFoundEnhanced';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/schedule';

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' ||
        (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="bg-[#F8F4F0] dark:bg-gray-900 transition-colors duration-300">
      {!isStandalonePage && <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <About />
              <NewsAndEvents />
              <Departments />
              <Services />
              <PhotoGallery />
              <TutorsSwiper />
              <Testimonials />
              <Contact />
            </main>
          }
        />
        <Route path="/student-life-login" element={<StudentLifeLogin />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isStandalonePage && <Footer />}
      <WhatsAppWidget />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AssignmentProvider>
        <Router>
          <AppContent />
        </Router>
      </AssignmentProvider>
    </AuthProvider>
  );
};

export default App;