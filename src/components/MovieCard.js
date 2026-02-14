import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function MovieCard({ title, year, rating, poster, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.details}>
          <Text style={styles.year}>{year}</Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 15,
    marginBottom: 20,
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  info: {
    marginTop: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    color: '#999',
    fontSize: 12,
  },
  rating: {
    color: '#ffd700',
    fontSize: 12,
  },
});
