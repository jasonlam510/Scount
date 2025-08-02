import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDatabase } from '../hooks'

const DatabaseTest: React.FC = () => {
  const { isConnected, isLoading, error, testConnection, getPlatformInfo } = useDatabase()
  const { platform } = getPlatformInfo()

  const getStatusText = () => {
    if (isLoading) return 'Testing...'
    if (error) return `❌ Error: ${error}`
    if (isConnected) return '✅ Database connected successfully!'
    return '❌ Database connection failed'
  }

  const getStatusColor = () => {
    if (isLoading) return '#007AFF'
    if (error || !isConnected) return '#FF3B30'
    return '#34C759'
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Connection Test</Text>
      <Text style={styles.platform}>Platform: {platform}</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: getStatusColor() }]} 
        onPress={testConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Database Connection'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.result}>{getStatusText()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  platform: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  result: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
})

export default DatabaseTest 