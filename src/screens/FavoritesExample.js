import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StorageManager } from '../services/storageManager';

/**
 * Exemplo prático de como usar o sistema de armazenamento
 */
export default function FavoritesExample() {
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadFavorites();
    checkLoginStatus();
  }, []);

  const loadFavorites = async () => {
    const favs = await StorageManager.getFavorites();
    setFavorites(favs);
  };

  const checkLoginStatus = async () => {
    const loggedIn = await StorageManager.isLoggedIn();
    setIsLoggedIn(loggedIn);
  };

  const handleAddFavorite = async () => {
    const exampleMovie = {
      id: Date.now(), // ID único
      title: 'Matrix',
      year: 1999,
      rating: 8.7,
      poster: 'https://via.placeholder.com/150x225'
    };

    const result = await StorageManager.addFavorite(exampleMovie);
    
    if (result.success) {
      Alert.alert('Sucesso!', 'Filme adicionado aos favoritos');
      loadFavorites();
    } else {
      Alert.alert('Atenção', result.message);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    const result = await StorageManager.removeFavorite(movieId);
    
    if (result.success) {
      Alert.alert('Sucesso!', 'Filme removido dos favoritos');
      loadFavorites();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Armazenamento</Text>
      
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          📱 Status: {isLoggedIn ? '☁️ Sincronizado com nuvem' : '💾 Apenas local'}
        </Text>
        <Text style={styles.statusText}>
          ⭐ Favoritos salvos: {favorites.length}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddFavorite}>
        <Text style={styles.buttonText}>Adicionar Favorito de Teste</Text>
      </TouchableOpacity>

      <View style={styles.favoritesList}>
        <Text style={styles.subtitle}>Meus Favoritos:</Text>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
        ) : (
          favorites.map((movie) => (
            <View key={movie.id} style={styles.favoriteItem}>
              <View>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <Text style={styles.movieDetails}>
                  {movie.year} • ⭐ {movie.rating}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleRemoveFavorite(movie.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Como funciona:</Text>
        <Text style={styles.infoText}>
          • Sem login: dados salvos apenas no celular{'\n'}
          • Com login: dados sincronizados na nuvem{'\n'}
          • Funciona offline e sincroniza quando conectar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statusBox: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritesList: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  movieDetails: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1a4d1a',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
});
