import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import api from '../../constants/api';

type AuthContextType = {
  token: string | null;
  role: string | null;
  name: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  name: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

// Helpers para manejar token en web y móvil
const getItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const setItem = async (key: string, value: string) => {
  
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getItem('token');
      const savedRole = await getItem('role');
      const savedName = await getItem('name');

      if (savedToken) setToken(savedToken);
      if (savedRole) setRole(savedRole);
      if (savedName) setName(savedName);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/login', { email, password });
      const newToken = response.data.token;
      const userRole = response.data.user.role;
      const userName = response.data.user.name;
  
      if (response.status === 200 && newToken) {
        // Guardar en almacenamiento seguro
        await setItem('token', newToken);
        await setItem('role', userRole);
        await setItem('name', userName);
  
        // Actualizar estado local
        setToken(newToken);
        setRole(userRole);
        setName(userName);
  
        return true;
      }
  
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    await deleteItem('token');
    await deleteItem('role');
    await deleteItem('name');
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role,name, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
