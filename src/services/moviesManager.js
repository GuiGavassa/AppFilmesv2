import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Gerenciador de filmes do app
 * Estados: 'pending' (aguardando escolha), 'chosen' (escolhido), 'rejected' (rejeitado)
 */

const STORAGE_KEY = '@movies_list';

export const MoviesManager = {
  // Buscar todos os filmes
  getAllMovies: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      return [];
    }
  },

  // Adicionar novo filme
  addMovie: async (movieData) => {
    try {
      const movies = await MoviesManager.getAllMovies();
      
      const newMovie = {
        id: Date.now(),
        title: movieData.title,
        description: movieData.description || '',
        year: movieData.year || '',
        genre: movieData.genre || '',
        platforms: movieData.platforms || [], // Array de plataformas
        posterUrl: movieData.posterUrl || null, // URL do poster do TMDb
        backdropUrl: movieData.backdropUrl || null, // URL do backdrop do TMDb
        status: 'pending', // pending, chosen, rejected
        addedAt: new Date().toISOString()
      };
      
      movies.push(newMovie);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
      
      return { success: true, movie: newMovie };
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      return { success: false, error };
    }
  },

  // Atualizar status do filme
  updateMovieStatus: async (movieId, status) => {
    try {
      const movies = await MoviesManager.getAllMovies();
      const updatedMovies = movies.map(movie => 
        movie.id === movieId ? { ...movie, status } : movie
      );
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMovies));
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar filme:', error);
      return { success: false, error };
    }
  },

  // Atualizar dados do filme
  updateMovie: async (movieId, movieData) => {
    try {
      const movies = await MoviesManager.getAllMovies();
      const updatedMovies = movies.map(movie => 
        movie.id === movieId ? { ...movie, ...movieData } : movie
      );
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMovies));
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar filme:', error);
      return { success: false, error };
    }
  },

  // Remover filme
  removeMovie: async (movieId) => {
    try {
      const movies = await MoviesManager.getAllMovies();
      const filteredMovies = movies.filter(movie => movie.id !== movieId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMovies));
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover filme:', error);
      return { success: false, error };
    }
  },

  // Buscar filmes por status
  getMoviesByStatus: async (status) => {
    const movies = await MoviesManager.getAllMovies();
    return movies.filter(movie => movie.status === status);
  },

  // Sortear um filme dos escolhidos
  drawRandomChosen: async () => {
    const chosen = await MoviesManager.getMoviesByStatus('chosen');
    
    if (chosen.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * chosen.length);
    return chosen[randomIndex];
  },

  // Limpar todos os filmes
  clearAll: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Erro ao limpar filmes:', error);
      return { success: false, error };
    }
  }
};
