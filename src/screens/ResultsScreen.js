import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MoviesManager } from '../services/moviesManager';

export default function ResultsScreen() {
  const [chosenMovies, setChosenMovies] = useState([]);
  const [rejectedMovies, setRejectedMovies] = useState([]);
  const [drawnMovie, setDrawnMovie] = useState(null);
  const [showDrawn, setShowDrawn] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const chosen = await MoviesManager.getMoviesByStatus('chosen');
    const rejected = await MoviesManager.getMoviesByStatus('rejected');
    setChosenMovies(chosen);
    setRejectedMovies(rejected);
  };

  const handleDraw = async () => {
    const randomMovie = await MoviesManager.drawRandomChosen();
    
    if (randomMovie) {
      setDrawnMovie(randomMovie);
      setShowDrawn(true);
      
      // Animação de aparecer
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeDrawnModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowDrawn(false);
      setDrawnMovie(null);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Resultados</Text>
        </View>
        <Ionicons name="stats-chart" size={28} color="#e50914" />
      </View>

      <ScrollView style={styles.content}>
        {/* Seção de Filmes Escolhidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkmark-circle" size={24} color="#00ff00" />
              <Text style={styles.sectionTitle}>Escolhidos</Text>
            </View>
            <Text style={styles.sectionCount}>{chosenMovies.length}</Text>
          </View>

          {chosenMovies.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum filme escolhido ainda</Text>
          ) : (
            <>
              <View style={styles.moviesList}>
                {chosenMovies.map((movie) => (
                  <View key={movie.id} style={styles.movieItem}>
                    <View style={styles.movieInfo}>
                      <View style={styles.movieTitleRow}>
                        <Ionicons name="film" size={18} color="#00ff00" />
                        <Text style={styles.movieText}>{movie.title}</Text>
                      </View>
                      <View style={styles.movieMeta}>
                        {movie.year && (
                          <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={12} color="#999" />
                            <Text style={styles.movieYear}>{movie.year}</Text>
                          </View>
                        )}
                        {movie.genre && (
                          <View style={styles.metaItem}>
                            <MaterialIcons name="category" size={12} color="#999" />
                            <Text style={styles.movieYear}>{movie.genre}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.drawButton}
                onPress={handleDraw}
              >
                <Ionicons name="shuffle" size={28} color="#fff" />
                <Text style={styles.drawButtonText}>Sortear Filme</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Seção de Filmes Rejeitados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="close-circle" size={24} color="#ff0000" />
              <Text style={styles.sectionTitle}>Rejeitados</Text>
            </View>
            <Text style={styles.sectionCount}>{rejectedMovies.length}</Text>
          </View>

          {rejectedMovies.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum filme rejeitado ainda</Text>
          ) : (
            <View style={styles.moviesList}>
              {rejectedMovies.map((movie) => (
                <View key={movie.id} style={[styles.movieItem, styles.rejectedItem]}>
                  <View style={styles.movieInfo}>
                    <View style={styles.movieTitleRow}>
                      <Ionicons name="film" size={18} color="#ff0000" />
                      <Text style={styles.movieText}>{movie.title}</Text>
                    </View>
                    <View style={styles.movieMeta}>
                      {movie.year && (
                        <View style={styles.metaItem}>
                          <Ionicons name="calendar-outline" size={12} color="#999" />
                          <Text style={styles.movieYear}>{movie.year}</Text>
                        </View>
                      )}
                      {movie.genre && (
                        <View style={styles.metaItem}>
                          <MaterialIcons name="category" size={12} color="#999" />
                          <Text style={styles.movieYear}>{movie.genre}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal do filme sorteado */}
      {showDrawn && drawnMovie && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <Ionicons name="trophy" size={48} color="#ffd700" />
            <Text style={styles.modalTitle}>Filme Sorteado!</Text>
            
            <View style={styles.drawnCard}>
              <Ionicons name="film" size={64} color="#e50914" />
              <Text style={styles.drawnTitle}>{drawnMovie.title}</Text>
              
              <View style={styles.drawnDetails}>
                {drawnMovie.year && (
                  <View style={styles.drawnDetailItem}>
                    <Ionicons name="calendar" size={16} color="#999" />
                    <Text style={styles.drawnYear}>{drawnMovie.year}</Text>
                  </View>
                )}
                {drawnMovie.genre && (
                  <View style={styles.drawnDetailItem}>
                    <MaterialIcons name="category" size={16} color="#999" />
                    <Text style={styles.drawnYear}>{drawnMovie.genre}</Text>
                  </View>
                )}
              </View>

              {drawnMovie.description && (
                <Text style={styles.drawnDescription} numberOfLines={3}>
                  {drawnMovie.description}
                </Text>
              )}
            </View>

            <Text style={styles.drawnSubtext}>
              Aproveite o filme! 🍿
            </Text>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeDrawnModal}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
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
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionCount: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  moviesList: {
    gap: 10,
  },
  movieItem: {
    backgroundColor: '#1a4d1a',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff00',
    marginBottom: 10,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  movieText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  movieMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  movieYear: {
    color: '#aaa',
    fontSize: 13,
  },
  rejectedItem: {
    backgroundColor: '#4d1a1a',
    borderLeftColor: '#ff0000',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  drawButton: {
    backgroundColor: '#e50914',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    gap: 10,
  },
  drawButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Modal do sorteio
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e50914',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
  },
  drawnCard: {
    backgroundColor: '#2a2a2a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  drawnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  drawnDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  drawnDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  drawnYear: {
    fontSize: 16,
    color: '#999',
  },
  drawnDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  drawnSubtext: {
    fontSize: 16,
    color: '#999',
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#e50914',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
