import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 AppFilmes</Text>
        <Text style={styles.subtitle}>Seus filmes favoritos em um só lugar</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Em Alta</Text>
        <Text style={styles.placeholder}>
          Aqui vamos exibir os filmes populares...
        </Text>

        <Text style={styles.sectionTitle}>Lançamentos</Text>
        <Text style={styles.placeholder}>
          Aqui vamos exibir os últimos lançamentos...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
