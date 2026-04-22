import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// أنواع المستخدمين
export type UserType = 'student' | 'admin' | 'visitor';

// بيانات المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatar?: string;
}

// بيانات السياق
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// مكون Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // تحميل بيانات المستخدم من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem('alsharq_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('alsharq_user');
      }
    }
  }, []);

  // تسجيل الدخول
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('alsharq_user', JSON.stringify(userData));
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('alsharq_user');
  };

  // تحديث بيانات المستخدم
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('alsharq_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
