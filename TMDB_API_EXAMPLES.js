// Exemplos de uso do movieService
// Este arquivo é apenas para referência e testes

import { movieService } from './src/services/movieService';

/**
 * EXEMPLO 1: Buscar filmes por termo
 * Útil para: Autocomplete, busca em tempo real
 */
async function exemploSearchMovies() {
  const resultados = await movieService.searchMovies('matrix');
  console.log('Filmes encontrados:', resultados);
  
  // Retorna array de objetos com:
  // - id, title, description, year
  // - posterUrl, backdropUrl
  // - voteAverage, popularity
  // - genreIds
}

/**
 * EXEMPLO 2: Buscar detalhes completos de um filme
 * Útil para: Tela de detalhes, informações adicionais
 */
async function exemploGetMovieDetails() {
  const filme = await movieService.getMovieById(603); // Matrix
  console.log('Detalhes do filme:', filme);
  
  // Retorna objeto com informações completas:
  // - Todos os campos do search +
  // - runtime (duração em minutos)
  // - genres (texto formatado)
  // - genresList (array de objetos)
  // - budget, revenue
  // - status, tagline
}

/**
 * EXEMPLO 3: Buscar filmes populares
 * Útil para: Sugestões, explorar filmes
 */
async function exemploPopularMovies() {
  const populares = await movieService.getPopularMovies(1); // página 1
  console.log('Filmes populares:', populares);
  
  // Retorna array similar ao search
}

/**
 * EXEMPLO 4: Obter nome do gênero pelo ID
 * Útil para: Exibir gêneros de um filme
 */
function exemploGenres() {
  // Genre IDs do TMDb
  const actionId = 28;
  const nome = movieService.getGenreName(actionId);
  console.log('Gênero:', nome); // "Ação"
  
  // Converter array de IDs em texto
  const genreIds = [28, 12, 878]; // Ação, Aventura, Ficção Científica
  const generos = movieService.getGenresFromIds(genreIds);
  console.log('Gêneros:', generos); // "Ação, Aventura, Ficção Científica"
}

/**
 * EXEMPLO 5: Uso completo - fluxo de adicionar filme
 */
async function exemploFluxoCompleto() {
  // 1. Usuário digita "inception"
  const resultados = await movieService.searchMovies('inception');
  
  // 2. Usuário seleciona o primeiro resultado
  const filmeSelecionado = resultados[0];
  
  // 3. Preencher formulário com os dados
  const dadosFormulario = {
    title: filmeSelecionado.title,
    year: filmeSelecionado.year,
    description: filmeSelecionado.description,
    genre: movieService.getGenresFromIds(filmeSelecionado.genreIds).split(',')[0], // Primeiro gênero
  };
  
  console.log('Dados para o formulário:', dadosFormulario);
  
  // 4. Se quiser mais detalhes, buscar por ID
  const detalhes = await movieService.getMovieById(filmeSelecionado.id);
  console.log('Detalhes adicionais:', {
    runtime: detalhes.runtime + ' min',
    tagline: detalhes.tagline,
  });
}

/**
 * EXEMPLO 6: Tratamento de erros
 */
async function exemploErros() {
  // A API já trata erros e retorna array vazio ou null
  
  const semResultado = await movieService.searchMovies(''); // Array vazio
  const filmeInexistente = await movieService.getMovieById(999999999); // null
  
  console.log('Sem resultado:', semResultado); // []
  console.log('Filme inexistente:', filmeInexistente); // null
}

/**
 * MAPEAMENTO DE GÊNEROS
 * Todos os gêneros disponíveis no TMDb
 */
const GENRE_MAPPING = {
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
};

/**
 * URLS DE IMAGEM
 * Como construir URLs para posters e backdrops
 */
const IMAGE_EXAMPLES = {
  // Tamanhos disponíveis para posters
  posterSmall: 'https://image.tmdb.org/t/p/w185/caminho.jpg',
  posterMedium: 'https://image.tmdb.org/t/p/w342/caminho.jpg',
  posterLarge: 'https://image.tmdb.org/t/p/w500/caminho.jpg',
  
  // Tamanhos disponíveis para backdrops
  backdropSmall: 'https://image.tmdb.org/t/p/w300/caminho.jpg',
  backdropMedium: 'https://image.tmdb.org/t/p/w780/caminho.jpg',
  backdropLarge: 'https://image.tmdb.org/t/p/w1280/caminho.jpg',
  
  // Imagem original (maior qualidade)
  original: 'https://image.tmdb.org/t/p/original/caminho.jpg',
};

/**
 * DICAS DE PERFORMANCE
 */
const PERFORMANCE_TIPS = `
1. DEBOUNCE: Sempre use debounce ao buscar durante digitação
   - Aguarde 300-500ms após o usuário parar de digitar
   - Implementado no MoviesListScreen.js
   
2. CACHE: Considere cachear resultados de buscas recentes
   - Evita requisições duplicadas
   - Melhora experiência offline
   
3. LIMITE DE RESULTADOS: A API retorna 20 resultados por página
   - Para mais resultados, use o parâmetro page
   
4. IMAGENS: Use tamanhos apropriados
   - Thumbnails: w185
   - Cards: w342
   - Detalhes: w500
   - Background: w780 ou w1280
   
5. RATE LIMITING: Máximo 50 req/segundo
   - Para uso pessoal, improvável atingir
   - Implemente retry com backoff se necessário
`;

// TESTES RÁPIDOS
// Descomente para testar no console

// exemploSearchMovies();
// exemploGetMovieDetails();
// exemploPopularMovies();
// exemploGenres();
// exemploFluxoCompleto();

export {
  exemploSearchMovies,
  exemploGetMovieDetails,
  exemploPopularMovies,
  exemploGenres,
  exemploFluxoCompleto,
  GENRE_MAPPING,
  IMAGE_EXAMPLES,
  PERFORMANCE_TIPS,
};
