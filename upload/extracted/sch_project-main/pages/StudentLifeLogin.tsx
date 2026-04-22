import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const StudentLifeLogin: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                // Mock login logic
                const mockUser = {
                    id: 'student-' + Date.now(),
                    name: 'طالب تجريبي',
                    email: email,
                    type: 'student' as const,
                };

                if (email === 'admin@school.com') {
                    mockUser.type = 'admin';
                    mockUser.name = 'المسؤول';
                    mockUser.id = 'admin-1';
                }

                login(mockUser);

                if (mockUser.type === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            } else {
                // Mock registration logic
                const newUser = {
                    id: 'student-' + Date.now(),
                    name: name,
                    email: email,
                    type: 'student' as const,
                };

                login(newUser);
                navigate('/student-dashboard');
            }
        } catch (err) {
            setError('حدث خطأ أثناء العملية. الرجاء المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLogin ? 'مرحباً بك مجدداً في بوابة الحياة الطلابية' : 'انضم إلينا في رحلة التعلم'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                                الاسم الكامل
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                placeholder="الاسم الكامل"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            placeholder="example@school.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:shadow-outline transform transition-all duration-200 hover:scale-[1.02]"
                    >
                        {isLogin ? 'دخول' : 'تسجيل'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                    >
                        {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentLifeLogin;
