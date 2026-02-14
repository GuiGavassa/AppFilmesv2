import { LocalStorage, SecureStorage } from './localStorage';
import { CloudStorage } from './cloudStorage';

/**
 * Serviço HÍBRIDO que combina armazenamento local + nuvem
 * Sincroniza dados automaticamente quando há conexão
 */

export const StorageManager = {
  // ===== FAVORITOS =====
  
  // Adicionar filme aos favoritos
  addFavorite: async (movie, token = null) => {
    try {
      // 1. Buscar favoritos atuais do dispositivo
      const favorites = await LocalStorage.getFavorites();
      
      // 2. Verificar se já existe
      const exists = favorites.some(fav => fav.id === movie.id);
      if (exists) {
        console.log('Filme já está nos favoritos');
        return { success: false, message: 'Filme já está nos favoritos' };
      }
      
      // 3. Adicionar novo favorito
      const newFavorites = [...favorites, movie];
      
      // 4. Salvar localmente
      await LocalStorage.saveFavorites(newFavorites);
      
      // 5. Se tiver token, sincronizar com nuvem
      if (token) {
        await CloudStorage.syncFavorites(token, newFavorites);
        console.log('✅ Favorito salvo localmente e na nuvem');
      } else {
        console.log('✅ Favorito salvo apenas localmente (sem login)');
      }
      
      return { success: true, favorites: newFavorites };
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      return { success: false, error };
    }
  },

  // Remover favorito
  removeFavorite: async (movieId, token = null) => {
    try {
      const favorites = await LocalStorage.getFavorites();
      const newFavorites = favorites.filter(fav => fav.id !== movieId);
      
      await LocalStorage.saveFavorites(newFavorites);
      
      if (token) {
        await CloudStorage.syncFavorites(token, newFavorites);
      }
      
      return { success: true, favorites: newFavorites };
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return { success: false, error };
    }
  },

  // Buscar favoritos (tentando nuvem primeiro se tiver token)
  getFavorites: async (token = null) => {
    try {
      if (token) {
        // Tentar buscar da nuvem
        const cloudFavorites = await CloudStorage.getFavoritesFromCloud(token);
        
        if (cloudFavorites.length > 0) {
          // Atualizar cache local
          await LocalStorage.saveFavorites(cloudFavorites);
          return cloudFavorites;
        }
      }
      
      // Se não tem token ou nuvem vazia, buscar local
      return await LocalStorage.getFavorites();
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      // Em caso de erro, retornar cache local
      return await LocalStorage.getFavorites();
    }
  },

  // ===== AUTENTICAÇÃO =====

  login: async (email, password) => {
    try {
      // 1. Fazer login na nuvem
      const result = await CloudStorage.login(email, password);
      
      if (result.success) {
        // 2. Salvar token localmente de forma segura
        await SecureStorage.saveAuthToken(result.token);
        
        // 3. Sincronizar dados da nuvem para o dispositivo
        const cloudFavorites = await CloudStorage.getFavoritesFromCloud(result.token);
        const localFavorites = await LocalStorage.getFavorites();
        
        // Mesclar favoritos locais e da nuvem (sem duplicatas)
        const mergedFavorites = [...cloudFavorites];
        localFavorites.forEach(local => {
          if (!mergedFavorites.some(cloud => cloud.id === local.id)) {
            mergedFavorites.push(local);
          }
        });
        
        // Salvar mesclados localmente e sincronizar na nuvem
        await LocalStorage.saveFavorites(mergedFavorites);
        await CloudStorage.syncFavorites(result.token, mergedFavorites);
        
        console.log('✅ Login realizado e dados sincronizados');
        return result;
      }
      
      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  },

  logout: async () => {
    try {
      // Remover token de autenticação
      await SecureStorage.deleteAuthData();
      
      // Opcionalmente, limpar dados locais também
      // await LocalStorage.clearAll();
      
      console.log('✅ Logout realizado');
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error };
    }
  },

  // Verificar se usuário está logado
  isLoggedIn: async () => {
    const token = await SecureStorage.getAuthToken();
    return !!token;
  },

  // ===== PREFERÊNCIAS =====

  savePreferences: async (preferences) => {
    // Preferências geralmente são apenas locais
    await LocalStorage.savePreferences(preferences);
  },

  getPreferences: async () => {
    return await LocalStorage.getPreferences();
  }
};

// Exemplo de uso:
/*
// Adicionar favorito sem login (só local)
await StorageManager.addFavorite({
  id: 123,
  title: 'Matrix',
  year: 1999,
  rating: 8.7
});

// Fazer login e sincronizar
const loginResult = await StorageManager.login('user@email.com', 'senha123');
if (loginResult.success) {
  const token = loginResult.token;
  
  // Agora favoritos serão salvos localmente E na nuvem
  await StorageManager.addFavorite(movie, token);
}
*/
