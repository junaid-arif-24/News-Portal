import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
    navigate('/');
  };

  const register = async (name: string, email: string, password: string) => {
    const userData = await apiRegister(name, email, password);
    setUser(userData);
    navigate('/');
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
