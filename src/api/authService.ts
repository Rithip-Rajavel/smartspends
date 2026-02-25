import apiClient from './axiosConfig';
import { LoginRequestDTO, RegistrationRequestDTO } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (loginData: LoginRequestDTO) => {
    const response = await apiClient.post('/api/auth/login', loginData);
    return response.data;
  },

  register: async (registerData: RegistrationRequestDTO) => {
    const response = await apiClient.post('/api/auth/register', registerData);
    return response.data;
  },

  logout: async () => {
    // Clear local storage
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('authToken');
  },

  setToken: async (token: string) => {
    await AsyncStorage.setItem('authToken', token);
  },

  getUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: async (user: any) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
};
