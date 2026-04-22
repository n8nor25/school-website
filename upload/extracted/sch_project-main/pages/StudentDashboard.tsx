import React from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotebookLMAssistant from '../components/NotebookLMAssistant';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 100);
  };

  const studentFeatures = [
    {
      title: 'الجدول الدراسي',
      description: 'عرض مواعيد الحصص والاختبارات',
      icon: '📅',
      color: 'blue',
    },
    {
      title: 'الدرجات',
      description: 'متابعة درجاتك في جميع المواد',
      icon: '📊',
      color: 'green',
    },
    {
      title: 'الواجبات والتكليفات',
      description: 'عرض وتسليم الواجبات والتكليفات',
      icon: '📝',
      color: 'yellow',
      onClick: () => navigate('/student-assignments'),
    },
    {
      title: 'المواد الدراسية',
      description: 'الوصول للمواد والمراجع',
      icon: '📚',
      color: 'purple',
    },
    {
      title: 'الأنشطة',
      description: 'التسجيل في الأنشطة والفعاليات',
      icon: '🎯',
      color: 'red',
    },
    {
      title: 'التواصل',
      description: 'التواصل مع المعلمين والزملاء',
      icon: '💬',
      color: 'indigo',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">لوحة الطالب</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">مرحباً {user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">مرحباً {user?.name}</h2>
              <p className="text-blue-100">نتمنى لك يوماً دراسياً ممتعاً ومفيداً</p>
            </div>
          </div>
        </div>

        {/* Smart Assistant Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <NotebookLMAssistant />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={feature.onClick}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                <span className="text-sm font-medium">عرض التفاصيل</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up animate-delay-600">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">85%</h3>
                <p className="text-gray-600 dark:text-gray-400">متوسط الدرجات</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up animate-delay-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</h3>
                <p className="text-gray-600 dark:text-gray-400">مادة دراسية</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up animate-delay-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">5</h3>
                <p className="text-gray-600 dark:text-gray-400">أنشطة مسجلة</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
