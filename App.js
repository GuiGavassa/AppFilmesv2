import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import MoviesListScreen from './src/screens/MoviesListScreen';
import ChooseMoviesScreen from './src/screens/ChooseMoviesScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import BottomNav from './src/components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('list'); // 'list', 'choose', 'results'

  const renderScreen = () => {
    switch (currentScreen) {
      case 'list':
        return <MoviesListScreen />;
      case 'choose':
        return <ChooseMoviesScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <MoviesListScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
