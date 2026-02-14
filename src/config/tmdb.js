// Configuração da API do The Movie Database (TMDb)
// 
// ⚠️ IMPORTANTE: Você precisa configurar sua API Key para usar a busca de filmes!
// 
// 📝 COMO OBTER SUA API KEY (5 minutos):
// 1. Crie uma conta em: https://www.themoviedb.org/signup
// 2. Acesse: https://www.themoviedb.org/settings/api
// 3. Clique em "Solicitar chave de API" → "Developer"
// 4. Preencha:
//    - Nome: Meu App de Filmes
//    - URL: http://localhost
//    - Resumo: App pessoal para gerenciar filmes
// 5. Cole a "API Key (v3 auth)" abaixo
// 
// 💡 Veja mais detalhes em: TMDB_SETUP.md ou QUICK_START.md

export const TMDB_CONFIG = {
  API_KEY: 'SUA_API_KEY_AQUI', // ⬅️ Cole sua chave aqui!
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // Tamanhos de imagem disponíveis
  IMAGE_SIZES: {
    POSTER_SMALL: 'w185',
    POSTER_MEDIUM: 'w342',
    POSTER_LARGE: 'w500',
    BACKDROP_SMALL: 'w300',
    BACKDROP_MEDIUM: 'w780',
    BACKDROP_LARGE: 'w1280',
  }
};

// Verificar se a API Key está configurada
export const isApiKeyConfigured = () => {
  return TMDB_CONFIG.API_KEY && 
         TMDB_CONFIG.API_KEY !== 'SUA_API_KEY_AQUI' && 
         TMDB_CONFIG.API_KEY.length > 10;
};

// URL completa para imagens
export const getImageUrl = (path, size = TMDB_CONFIG.IMAGE_SIZES.POSTER_MEDIUM) => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};
