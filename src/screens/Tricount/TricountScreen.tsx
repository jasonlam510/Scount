import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TricountScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tricount</Text>
      <Text style={styles.subtitle}>Split expenses with friends</Text>
      <View style={styles.content}>
        <Text style={styles.description}>
          This screen will contain the Tricount functionality for splitting expenses between multiple people.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TricountScreen; 