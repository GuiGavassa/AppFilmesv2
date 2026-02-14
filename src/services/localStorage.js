import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Serviço para armazenamento LOCAL no dispositivo
 * Usa AsyncStorage para dados gerais e SecureStore para dados sensíveis
 */

// ===== ASYNCSTORAGE (dados gerais) =====

export const LocalStorage = {
  // Salvar filmes favoritos
  saveFavorites: async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('✅ Favoritos salvos localmente');
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  },

  // Buscar filmes favoritos
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  },

  // Salvar preferências do usuário
  savePreferences: async (preferences) => {
    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
      console.log('✅ Preferências salvas');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  },

  // Buscar preferências
  getPreferences: async () => {
    try {
      const prefs = await AsyncStorage.getItem('preferences');
      return prefs ? JSON.parse(prefs) : {
        theme: 'dark',
        notifications: true,
        language: 'pt-BR'
      };
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      return null;
    }
  },

  // Limpar todos os dados locais
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      console.log('✅ Dados locais limpos');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
};

// ===== SECURE STORE (dados sensíveis) =====

export const SecureStorage = {
  // Salvar token de autenticação
  saveAuthToken: async (token) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      console.log('✅ Token salvo de forma segura');
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  },

  // Buscar token
  getAuthToken: async () => {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  },

  // Salvar credenciais
  saveCredentials: async (email, password) => {
    try {
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('userPassword', password);
      console.log('✅ Credenciais salvas de forma segura');
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  },

  // Deletar dados sensíveis
  deleteAuthData: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userPassword');
      console.log('✅ Dados sensíveis removidos');
    } catch (error) {
      console.error('Erro ao deletar dados:', error);
    }
  }
};
