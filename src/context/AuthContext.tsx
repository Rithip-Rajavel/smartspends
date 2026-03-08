import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api';
import { NativeModules } from 'react-native';

const { SharedPrefsModule } = NativeModules;

interface User {
  id: number;
  username: string;
  mobileNumber: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobileNumber: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await authService.getToken();
      const userData = await authService.getUser();
      
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobileNumber: string, password: string) => {
    try {
      const response = await authService.login({ mobileNumber, password });
      
      const payload = response.data || response;
      if (payload && payload.token) {
        await authService.setToken(payload.token);
        SharedPrefsModule?.setToken(payload.token);
        
        const userData = payload.user || {
          id: payload.id || Date.now(),
          username: payload.username || 'User',
          mobileNumber: payload.mobileNumber || mobileNumber,
          email: payload.email,
          role: payload.role
        };
        
        await authService.setUser(userData);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      
      const payload = response.data || response;
      if (payload && payload.token) {
        await authService.setToken(payload.token);
        SharedPrefsModule?.setToken(payload.token);
        
        const registeredUser = payload.user || {
          id: payload.id || Date.now(),
          username: payload.username || userData.username || 'User',
          mobileNumber: payload.mobileNumber || userData.mobileNumber,
          email: payload.email || userData.email,
          role: payload.role || 'USER'
        };
        
        await authService.setUser(registeredUser);
        setUser(registeredUser);
      } else {
        throw new Error(response.message || 'Registration failed: No token received');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      SharedPrefsModule?.clearToken();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
