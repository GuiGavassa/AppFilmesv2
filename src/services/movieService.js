// Serviço para integração com API de filmes TMDb (The Movie Database)
import { TMDB_CONFIG, getImageUrl, isApiKeyConfigured } from '../config/tmdb';

export const movieService = {
  // Buscar filmes por termo (com debounce recomendado no componente)
  searchMovies: async (query) => {
    try {
      // Verificar se a API Key está configurada
      if (!isApiKeyConfigured()) {
        console.warn('⚠️ API Key do TMDb não configurada!');
        console.warn('📝 Configure em: src/config/tmdb.js');
        console.warn('📚 Veja instruções em: QUICK_START.md');
        return [];
      }

      if (!query || query.trim().length < 2) {
        return [];
      }

      const url = `${TMDB_CONFIG.BASE_URL}/search/movie?api_key=${TMDB_CONFIG.API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('\n╔════════════════════════════════════════════════════════╗');
          console.error('║  ⚠️  ERRO 401: API Key não configurada ou inválida  ║');
          console.error('╚════════════════════════════════════════════════════════╝\n');
          console.error('📝 SOLUÇÃO RÁPIDA:');
          console.error('1. Abra: src/config/tmdb.js');
          console.error('2. Configure sua API Key do TMDb');
          console.error('3. Salve e recarregue o app\n');
          console.error('📚 AJUDA DETALHADA:');
          console.error('• LEIA_ME_ERRO_401.md (guia rápido)');
          console.error('• QUICK_START.md (3 passos)');
          console.error('• ERRO_401_SOLUCAO.txt (detalhado)\n');
          console.error('🔑 Obtenha sua chave em:');
          console.error('https://www.themoviedb.org/settings/api\n');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formatando os dados para o formato do app
      return data.results.map(movie => ({
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        description: movie.overview || '',
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        posterUrl: getImageUrl(movie.poster_path),
        backdropUrl: getImageUrl(movie.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP_MEDIUM),
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        genreIds: movie.genre_ids,
      }));
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      return [];
    }
  },

  // Buscar detalhes completos do filme por ID
  getMovieById: async (id) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=pt-BR`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const movie = await response.json();
      
      return {
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        description: movie.overview || '',
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        posterUrl: getImageUrl(movie.poster_path),
        backdropUrl: getImageUrl(movie.backdrop_path, TMDB_CONFIG.IMAGE_SIZES.BACKDROP_MEDIUM),
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        runtime: movie.runtime,
        genres: movie.genres ? movie.genres.map(g => g.name).join(', ') : '',
        genresList: movie.genres || [],
        budget: movie.budget,
        revenue: movie.revenue,
        status: movie.status,
        tagline: movie.tagline,
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }
  },

  // Buscar filmes populares
  getPopularMovies: async (page = 1) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}&language=pt-BR&page=${page}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results.map(movie => ({
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        description: movie.overview || '',
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
        posterUrl: getImageUrl(movie.poster_path),
        voteAverage: movie.vote_average,
        popularity: movie.popularity,
      }));
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      return [];
    }
  },

  // Mapeamento de gêneros do TMDb
  genresMap: {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'Cinema TV',
    53: 'Suspense',
    10752: 'Guerra',
    37: 'Faroeste',
  },

  // Obter nome do gênero pelo ID
  getGenreName: (genreId) => {
    return movieService.genresMap[genreId] || '';
  },

  // Obter gêneros de um filme (array de IDs)
  getGenresFromIds: (genreIds) => {
    if (!genreIds || genreIds.length === 0) return '';
    return genreIds
      .map(id => movieService.getGenreName(id))
      .filter(name => name)
      .join(', ');
  },
};
