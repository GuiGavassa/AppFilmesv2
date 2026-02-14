/**
 * Serviço para armazenamento na NUVEM
 * Este é um exemplo genérico que pode ser adaptado para:
 * - Firebase (Google)
 * - Supabase (alternativa open-source)
 * - Sua própria API REST
 */

// Exemplo com API REST própria
const API_URL = 'https://sua-api.com/api';

export const CloudStorage = {
  // ===== AUTENTICAÇÃO =====
  
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.token) {
        // Salvar token localmente para próximas requisições
        return { success: true, token: data.token, user: data.user };
      }
      
      return { success: false, error: data.message };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  },

  // ===== SINCRONIZAÇÃO DE FAVORITOS =====

  syncFavorites: async (token, favorites) => {
    try {
      const response = await fetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ favorites })
      });
      
      const data = await response.json();
      console.log('✅ Favoritos sincronizados na nuvem');
      return data;
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error);
      return { success: false };
    }
  },

  getFavoritesFromCloud: async (token) => {
    try {
      const response = await fetch(`${API_URL}/user/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data.favorites || [];
    } catch (error) {
      console.error('Erro ao buscar favoritos da nuvem:', error);
      return [];
    }
  },

  // ===== PERFIL DO USUÁRIO =====

  updateProfile: async (token, profileData) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      console.log('✅ Perfil atualizado na nuvem');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false };
    }
  },

  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }
};

// ===== EXEMPLO COM FIREBASE =====
// Para usar Firebase, instale: npx expo install firebase
/*
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const FirebaseStorage = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  saveFavorites: async (userId, favorites) => {
    await setDoc(doc(db, 'users', userId), {
      favorites: favorites
    }, { merge: true });
  },

  getFavorites: async (userId) => {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data().favorites : [];
  }
};
*/
