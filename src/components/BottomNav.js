import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, currentScreen === 'list' && styles.activeTab]}
        onPress={() => onNavigate('list')}
      >
        <Ionicons 
          name={currentScreen === 'list' ? "list" : "list-outline"} 
          size={24} 
          color={currentScreen === 'list' ? '#e50914' : '#666'} 
        />
        <Text style={[styles.label, currentScreen === 'list' && styles.activeLabel]}>
          Lista
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, currentScreen === 'choose' && styles.activeTab]}
        onPress={() => onNavigate('choose')}
      >
        <MaterialCommunityIcons 
          name="card-multiple" 
          size={24} 
          color={currentScreen === 'choose' ? '#e50914' : '#666'} 
        />
        <Text style={[styles.label, currentScreen === 'choose' && styles.activeLabel]}>
          Escolher
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, currentScreen === 'results' && styles.activeTab]}
        onPress={() => onNavigate('results')}
      >
        <Ionicons 
          name={currentScreen === 'results' ? "trophy" : "trophy-outline"} 
          size={24} 
          color={currentScreen === 'results' ? '#e50914' : '#666'} 
        />
        <Text style={[styles.label, currentScreen === 'results' && styles.activeLabel]}>
          Resultado
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#e50914',
  },
  label: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  activeLabel: {
    color: '#e50914',
  },
});
