import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MoviesManager } from '../services/moviesManager';

export default function ChooseMoviesScreen() {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    loadPendingMovies();
  }, []);

  const loadPendingMovies = async () => {
    const pending = await MoviesManager.getMoviesByStatus('pending');
    setPendingMovies(pending);
    if (pending.length > 0) {
      setCurrentMovie(pending[0]);
      setCurrentIndex(0);
    }
  };

  const handleChoice = async (choice) => {
    if (!currentMovie) return;

    // Animação de fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      // Atualizar status do filme
      const status = choice === 'accept' ? 'chosen' : 'rejected';
      await MoviesManager.updateMovieStatus(currentMovie.id, status);

      // Próximo filme
      const nextIndex = currentIndex + 1;
      if (nextIndex < pendingMovies.length) {
        setCurrentMovie(pendingMovies[nextIndex]);
        setCurrentIndex(nextIndex);
      } else {
        setCurrentMovie(null);
      }

      // Fade in do próximo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  if (pendingMovies.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Escolher Filmes</Text>
          <Ionicons name="shuffle" size={28} color="#e50914" />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="sparkles" size={64} color="#333" />
          <Text style={styles.emptyText}>Nenhum filme aguardando escolha</Text>
          <Text style={styles.emptySubtext}>
            Adicione filmes na aba "Lista" primeiro
          </Text>
        </View>
      </View>
    );
  }

  if (!currentMovie) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Escolher Filmes</Text>
          <Ionicons name="shuffle" size={28} color="#e50914" />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={64} color="#00ff00" />
          <Text style={styles.emptyText}>Todos os filmes foram avaliados!</Text>
          <Text style={styles.emptySubtext}>
            Veja os resultados na aba "Resultado"
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Escolher Filmes</Text>
          <Text style={styles.counter}>
            {currentIndex + 1} de {pendingMovies.length}
          </Text>
        </View>
        <Ionicons name="shuffle" size={28} color="#e50914" />
      </View>

      <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Ionicons name="film" size={80} color="#e50914" />
            <Text style={styles.movieTitle}>{currentMovie.title}</Text>
            
            <View style={styles.movieDetails}>
              {currentMovie.year && (
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#999" />
                  <Text style={styles.detailText}>{currentMovie.year}</Text>
                </View>
              )}
              
              {currentMovie.genre && (
                <View style={styles.detailItem}>
                  <MaterialIcons name="category" size={16} color="#999" />
                  <Text style={styles.detailText}>{currentMovie.genre}</Text>
                </View>
              )}
            </View>

            {currentMovie.description && (
              <Text style={styles.movieDescription} numberOfLines={4}>
                {currentMovie.description}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleChoice('reject')}
        >
          <Ionicons name="close-circle" size={32} color="#fff" />
          <Text style={styles.buttonText}>Rejeitar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleChoice('accept')}
        >
          <Ionicons name="checkmark-circle" size={32} color="#fff" />
          <Text style={styles.buttonText}>Escolher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentIndex + 1) / pendingMovies.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
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
  counter: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    height: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  cardContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  movieDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: '#999',
    fontSize: 15,
  },
  movieDescription: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#8b0000',
  },
  acceptButton: {
    backgroundColor: '#006400',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e50914',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
