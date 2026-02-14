import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MoviesManager } from '../services/moviesManager';
import { movieService } from '../services/movieService';
import { isApiKeyConfigured } from '../config/tmdb';

// Gêneros disponíveis
const GENRES = [
  'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica',
  'Terror', 'Romance', 'Suspense', 'Animação', 'Documentário'
];

// Plataformas de streaming
const PLATFORMS = [
  { id: 'netflix', name: 'Netflix', color: '#E50914' },
  { id: 'prime', name: 'Prime Video', color: '#00A8E1' },
  { id: 'disney', name: 'Disney+', color: '#113CCF' },
  { id: 'hbo', name: 'HBO Max', color: '#B100FF' },
  { id: 'apple', name: 'Apple TV+', color: '#000000' },
  { id: 'paramount', name: 'Paramount+', color: '#0064FF' },
  { id: 'star', name: 'Star+', color: '#FFB800' },
  { id: 'globo', name: 'Globoplay', color: '#FE3800' },
];

export default function MoviesListScreen() {
  const [movies, setMovies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null); // null = modo adicionar, objeto = modo editar
  
  // Dados do filme
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [moviePlatforms, setMoviePlatforms] = useState([]);

  // Busca de filmes TMDb
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const allMovies = await MoviesManager.getAllMovies();
    setMovies(allMovies);
  };

  // Buscar filmes na API do TMDb com debounce
  const handleSearchMovies = async (text) => {
    setMovieTitle(text);
    
    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Se o texto for muito curto, limpar resultados
    if (text.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Verificar se a API Key está configurada
    if (!isApiKeyConfigured()) {
      Alert.alert(
        '⚠️ API Key não configurada',
        'Para usar a busca de filmes, você precisa configurar sua chave de API do TMDb.\n\n' +
        '📝 Abra o arquivo:\nsrc/config/tmdb.js\n\n' +
        '📚 Veja instruções em:\nQUICK_START.md ou ERRO_401_SOLUCAO.txt',
        [{ text: 'OK' }]
      );
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Debounce: esperar 500ms após o usuário parar de digitar
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchResults(true);
      
      const results = await movieService.searchMovies(text);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // Selecionar um filme da busca
  const handleSelectMovie = (movie) => {
    setMovieTitle(movie.title);
    setMovieYear(movie.year);
    setMovieDescription(movie.description);
    
    // Tentar mapear o primeiro gênero
    if (movie.genreIds && movie.genreIds.length > 0) {
      const genreName = movieService.getGenreName(movie.genreIds[0]);
      if (genreName && GENRES.includes(genreName)) {
        setMovieGenre(genreName);
      }
    }
    
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSaveMovie = async () => {
    if (!movieTitle.trim()) {
      Alert.alert('Atenção', 'Digite o nome do filme');
      return;
    }

    const movieData = {
      title: movieTitle,
      year: movieYear,
      description: movieDescription,
      genre: movieGenre,
      platforms: moviePlatforms
    };

    if (editingMovie) {
      // Modo edição
      const result = await MoviesManager.updateMovie(editingMovie.id, movieData);
      if (result.success) {
        clearForm();
        loadMovies();
        Alert.alert('Sucesso!', 'Filme atualizado');
      }
    } else {
      // Modo adicionar
      const result = await MoviesManager.addMovie(movieData);
      if (result.success) {
        clearForm();
        loadMovies();
        Alert.alert('Sucesso!', 'Filme adicionado à lista');
      }
    }
  };

  const clearForm = () => {
    setMovieTitle('');
    setMovieYear('');
    setMovieDescription('');
    setMovieGenre('');
    setMoviePlatforms([]);
    setModalVisible(false);
    setEditingMovie(null);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieTitle(movie.title);
    setMovieYear(movie.year || '');
    setMovieDescription(movie.description || '');
    setMovieGenre(movie.genre || '');
    setMoviePlatforms(movie.platforms || []);
    setModalVisible(true);
    setExpandedMovieId(null);
  };

  const togglePlatform = (platformId) => {
    if (moviePlatforms.includes(platformId)) {
      setMoviePlatforms(moviePlatforms.filter(p => p !== platformId));
    } else {
      setMoviePlatforms([...moviePlatforms, platformId]);
    }
  };

  const getPlatformName = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };

  const getPlatformColor = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform ? platform.color : '#666';
  };

  const handleRemoveMovie = (movieId, movieTitle) => {
    Alert.alert(
      'Excluir filme',
      `Tem certeza que deseja excluir "${movieTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            await MoviesManager.removeMovie(movieId);
            setModalVisible(false);
            setEditingMovie(null);
            loadMovies();
            Alert.alert('Sucesso!', 'Filme excluído');
          }
        }
      ]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'chosen': return { name: 'checkmark-circle', color: '#00ff00' };
      case 'rejected': return { name: 'close-circle', color: '#ff0000' };
      default: return { name: 'time', color: '#ffa500' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'chosen': return 'Escolhido';
      case 'rejected': return 'Rejeitado';
      default: return 'Aguardando';
    }
  };

  const renderMovie = ({ item }) => {
    const isExpanded = expandedMovieId === item.id;
    const statusIcon = getStatusIcon(item.status);

    return (
      <View style={styles.movieItem}>
        <TouchableOpacity 
          style={styles.movieHeader}
          onPress={() => setExpandedMovieId(isExpanded ? null : item.id)}
        >
          <View style={styles.movieMainInfo}>
            <View style={styles.titleRow}>
              <Ionicons name="film" size={20} color="#e50914" />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
            
            <View style={styles.movieMeta}>
              {item.year ? (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#999" />
                  <Text style={styles.metaText}>{item.year}</Text>
                </View>
              ) : null}
              
              {item.genre ? (
                <View style={styles.metaItem}>
                  <MaterialIcons name="category" size={14} color="#999" />
                  <Text style={styles.metaText}>{item.genre}</Text>
                </View>
              ) : null}

              <View style={styles.metaItem}>
                <Ionicons name={statusIcon.name} size={14} color={statusIcon.color} />
                <Text style={[styles.metaText, { color: statusIcon.color }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>

            {item.platforms && item.platforms.length > 0 && (
              <View style={styles.platformsContainer}>
                {item.platforms.map(platformId => (
                  <View 
                    key={platformId}
                    style={[
                      styles.platformBadge,
                      { backgroundColor: getPlatformColor(platformId) }
                    ]}
                  >
                    <Text style={styles.platformBadgeText}>
                      {getPlatformName(platformId)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.movieActions}>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {item.description && (
              <>
                <Text style={styles.descriptionLabel}>Descrição:</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={() => handleEditMovie(item)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#4a90e2" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleRemoveMovie(item.id, item.title)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ff0000" />
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Filmes</Text>
          <Text style={styles.subtitle}>{movies.length} filmes na lista</Text>
        </View>
        <Ionicons name="film-outline" size={32} color="#e50914" />
      </View>

      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMovie}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={64} color="#333" />
            <Text style={styles.emptyText}>Nenhum filme adicionado ainda</Text>
            <Text style={styles.emptySubtext}>Toque no botão + para começar</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setEditingMovie(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal para adicionar/editar filme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={clearForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMovie ? 'Editar Filme' : 'Adicionar Filme'}
              </Text>
              <TouchableOpacity onPress={clearForm}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Título com busca */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Ionicons name="film" size={16} color="#e50914" /> Título *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do filme para buscar..."
                  placeholderTextColor="#666"
                  value={movieTitle}
                  onChangeText={handleSearchMovies}
                />
                
                {/* Resultados da busca */}
                {showSearchResults && (
                  <View style={styles.searchResultsContainer}>
                    {isSearching ? (
                      <View style={styles.searchLoading}>
                        <ActivityIndicator size="small" color="#e50914" />
                        <Text style={styles.searchLoadingText}>Buscando filmes...</Text>
                      </View>
                    ) : searchResults.length > 0 ? (
                      <ScrollView style={styles.searchResults} nestedScrollEnabled={true}>
                        {searchResults.map((result) => (
                          <TouchableOpacity
                            key={result.id}
                            style={styles.searchResultItem}
                            onPress={() => handleSelectMovie(result)}
                          >
                            {result.posterUrl ? (
                              <Image 
                                source={{ uri: result.posterUrl }} 
                                style={styles.searchResultPoster}
                              />
                            ) : (
                              <View style={[styles.searchResultPoster, styles.searchResultPosterPlaceholder]}>
                                <Ionicons name="film" size={24} color="#666" />
                              </View>
                            )}
                            <View style={styles.searchResultInfo}>
                              <Text style={styles.searchResultTitle} numberOfLines={2}>
                                {result.title}
                              </Text>
                              <View style={styles.searchResultMeta}>
                                {result.year && (
                                  <Text style={styles.searchResultYear}>{result.year}</Text>
                                )}
                                {result.genreIds && result.genreIds.length > 0 && (
                                  <Text style={styles.searchResultGenre}>
                                    {movieService.getGenresFromIds(result.genreIds.slice(0, 2))}
                                  </Text>
                                )}
                              </View>
                              {result.voteAverage > 0 && (
                                <View style={styles.searchResultRating}>
                                  <Ionicons name="star" size={12} color="#ffd700" />
                                  <Text style={styles.searchResultRatingText}>
                                    {result.voteAverage.toFixed(1)}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <View style={styles.searchEmpty}>
                        <Ionicons name="search" size={32} color="#666" />
                        <Text style={styles.searchEmptyText}>Nenhum filme encontrado</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Ano */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Ionicons name="calendar" size={16} color="#e50914" /> Ano
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 2024"
                  placeholderTextColor="#666"
                  value={movieYear}
                  onChangeText={setMovieYear}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              {/* Descrição */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Ionicons name="document-text" size={16} color="#e50914" /> Descrição
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Sinopse ou observações sobre o filme"
                  placeholderTextColor="#666"
                  value={movieDescription}
                  onChangeText={setMovieDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Gênero */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <MaterialIcons name="category" size={16} color="#e50914" /> Gênero
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.genreScroll}
                >
                  {GENRES.map(genre => (
                    <TouchableOpacity
                      key={genre}
                      style={[
                        styles.genreChip,
                        movieGenre === genre && styles.genreChipSelected
                      ]}
                      onPress={() => setMovieGenre(genre)}
                    >
                      <Text style={[
                        styles.genreChipText,
                        movieGenre === genre && styles.genreChipTextSelected
                      ]}>
                        {genre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Plataformas */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Ionicons name="tv" size={16} color="#e50914" /> Plataformas
                </Text>
                <View style={styles.platformsGrid}>
                  {PLATFORMS.map(platform => (
                    <TouchableOpacity
                      key={platform.id}
                      style={[
                        styles.platformChip,
                        moviePlatforms.includes(platform.id) && {
                          backgroundColor: platform.color,
                          borderColor: platform.color
                        }
                      ]}
                      onPress={() => togglePlatform(platform.id)}
                    >
                      <Text style={[
                        styles.platformChipText,
                        moviePlatforms.includes(platform.id) && styles.platformChipTextSelected
                      ]}>
                        {platform.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              {editingMovie && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.deleteModalButton]}
                  onPress={() => handleRemoveMovie(editingMovie.id, editingMovie.title)}
                >
                  <Ionicons name="trash" size={20} color="#ff0000" />
                  <Text style={styles.deleteModalButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.cancelButton,
                  editingMovie && { flex: 0.5 }
                ]}
                onPress={clearForm}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  editingMovie && { flex: 0.5 }
                ]}
                onPress={handleSaveMovie}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.confirmButtonText}>
                  {editingMovie ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    padding: 15,
  },
  movieItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  movieHeader: {
    flexDirection: 'row',
    padding: 15,
  },
  movieMainInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  movieMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#999',
    fontSize: 13,
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  platformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  movieActions: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  expandedContent: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  descriptionLabel: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a2d4d',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  editButtonText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2a0000',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  deleteButtonText: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e50914',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalForm: {
    paddingHorizontal: 25,
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  genreScroll: {
    marginTop: 5,
  },
  genreChip: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  genreChipSelected: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  genreChipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  genreChipTextSelected: {
    color: '#fff',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  platformChip: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  platformChipText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  platformChipTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    padding: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#e50914',
  },
  deleteModalButton: {
    backgroundColor: '#2a0000',
    borderWidth: 1,
    borderColor: '#ff0000',
    flex: 1,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalButtonText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos de busca
  searchResultsContainer: {
    backgroundColor: '#2a2a2a',
    marginTop: 8,
    borderRadius: 10,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  searchLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  searchLoadingText: {
    color: '#999',
    fontSize: 14,
  },
  searchResults: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    alignItems: 'center',
    gap: 12,
  },
  searchResultPoster: {
    width: 50,
    height: 75,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  searchResultPosterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  searchResultYear: {
    color: '#999',
    fontSize: 12,
  },
  searchResultGenre: {
    color: '#999',
    fontSize: 12,
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  searchResultRatingText: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
  },
  searchEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  searchEmptyText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});
