import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Schedule {
    id: string;
    name: string;
    grade: string;
    type: string;
    uploadDate: string;
    fileUrl: string;
}

const Schedule: React.FC = () => {
    const navigate = useNavigate();

    // Mock schedule data
    const [schedules] = useState<Schedule[]>([
        {
            id: '1',
            name: 'جدول الصف الأول الإعدادي',
            grade: 'الأول الإعدادي',
            type: 'الفصل الدراسي الثاني',
            uploadDate: '2024-01-20',
            fileUrl: '/schedule/فصل.pdf'
        },
        {
            id: '2',
            name: 'جدول الصف الثاني الإعدادي',
            grade: 'الثاني الإعدادي',
            type: 'الفصل الدراسي الثاني',
            uploadDate: '2024-01-20',
            fileUrl: '/schedule/فصل.pdf'
        },
        {
            id: '3',
            name: 'جدول الصف الثالث الإعدادي',
            grade: 'الثالث الإعدادي',
            type: 'الفصل الدراسي الثاني',
            uploadDate: '2024-01-20',
            fileUrl: '/schedule/فصل.pdf'
        },
        {
            id: '4',
            name: 'جدول المعلمين',
            grade: 'هيئة التدريس',
            type: 'الفصل الدراسي الثاني',
            uploadDate: '2024-01-18',
            fileUrl: '/schedule/معلم.pdf'
        },
    ]);

    const [selectedGrade, setSelectedGrade] = useState<string>('all');

    const filteredSchedules = selectedGrade === 'all'
        ? schedules
        : schedules.filter(s => s.grade === selectedGrade);

    const grades = ['all', ...Array.from(new Set(schedules.map(s => s.grade)))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-sans" dir="rtl">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-md border-b border-purple-700/30 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">العودة للرئيسية</span>
                        </button>
                        <h1 className="text-2xl font-bold text-white">الجداول الدراسية</h1>
                        <div className="w-32"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-6xl">📅</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3">الجداول الدراسية</h2>
                        <p className="text-purple-200 text-lg">
                            جميع الجداول الدراسية للفصول والمعلمين
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-white font-medium">تصفية حسب:</span>
                        <div className="flex flex-wrap gap-2">
                            {grades.map((grade) => (
                                <button
                                    key={grade}
                                    onClick={() => setSelectedGrade(grade)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedGrade === grade
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    {grade === 'all' ? 'الكل' : grade}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Schedules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-4xl">📄</span>
                                </div>
                            </div>

                            {/* Schedule Info */}
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-white mb-2">{schedule.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-purple-200">
                                        <span className="text-sm">📚</span>
                                        <span className="text-sm">{schedule.grade}</span>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-purple-200">
                                        <span className="text-sm">🕒</span>
                                        <span className="text-sm">تاريخ الرفع: {schedule.uploadDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.open(schedule.fileUrl, '_blank')}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>👁️</span>
                                    <span>عرض</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = schedule.fileUrl;
                                        link.download = `${schedule.name}.pdf`;
                                        link.click();
                                    }}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>⬇️</span>
                                    <span>تحميل</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredSchedules.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl p-8">
                            <span className="text-6xl mb-4 block">📭</span>
                            <p className="text-white text-xl font-medium">لا توجد جداول متاحة</p>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">ℹ️</span>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">ملاحظة هامة</h3>
                            <p className="text-purple-100">
                                جميع الجداول متاحة بصيغة PDF. يمكنك عرضها مباشرة أو تحميلها على جهازك.
                                في حالة وجود أي استفسار، يرجى التواصل مع الإدارة.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900/50 backdrop-blur-md border-t border-purple-700/30 mt-12">
                <div className="container mx-auto px-6 py-6 text-center">
                    <p className="text-purple-200">
                        © 2024 مدرسة الاحايوه شرق - جميع الحقوق محفوظة
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Schedule;
