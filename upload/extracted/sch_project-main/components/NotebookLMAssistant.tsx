import React from 'react';

const NotebookLMAssistant: React.FC = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 group">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Content Container */}
            <div className="relative bg-gray-900/80 backdrop-blur-md rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center shadow-lg animate-pulse">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
                            المساعد الذكي للدراسة
                        </h2>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl">
                        استمتع بتجربة تعلم فريدة مع مساعدنا الذكي الجديد المدعوم من Google.
                        يمكنك رفع ملفاتك ومناقشتها، الحصول على ملخصات، وإجابات دقيقة لأسئلتك الدراسية.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-blue-200 flex items-center gap-2">
                            <span>📚</span> شرح الدروس
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-purple-200 flex items-center gap-2">
                            <span>📝</span> تلخيص الملفات
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-pink-200 flex items-center gap-2">
                            <span>💡</span> أسئلة وأجوبة
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                    <a
                        href="https://notebooklm.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex group/btn"
                    >
                        <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover/btn:opacity-100 group-hover/btn:-inset-1 group-hover/btn:duration-200 animate-tilt"></div>
                        <button className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                            <span className="ml-2 text-2xl">🚀</span>
                            ابدأ التعلم الآن
                        </button>
                    </a>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
    );
};

export default NotebookLMAssistant;
