// src/utils/tokenStorage.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem('userToken');
    }
    return AsyncStorage.getItem('userToken');
  },

  async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      return localStorage.setItem('userToken', token);
    }
    return AsyncStorage.setItem('userToken', token);
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      return localStorage.removeItem('userToken');
    }
    return AsyncStorage.removeItem('userToken');
  }
};