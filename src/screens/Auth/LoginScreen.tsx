import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supbabase';
import { useI18n, useTheme } from '../../hooks';
import CheckEmailScreen from './CheckEmailScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const { t } = useI18n();
  const { colors } = useTheme();
  
  const handleOTPLogin = async () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('auth.emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('auth.invalidEmail'));
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true, // Allow new users to sign up
        },
      });

      if (error) {
        console.error('OTP error:', error);
        Alert.alert(t('common.error'), error.message);
      } else {
        // Navigate to OTP input screen
        setShowCheckEmail(true);
      }
    } catch (error) {
      console.error('OTP error:', error);
      Alert.alert(t('common.error'), t('auth.somethingWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowCheckEmail(false);
    setEmail(''); // Clear email for fresh start
  };

  // Show CheckEmailScreen if magic link was sent
  if (showCheckEmail) {
    return <CheckEmailScreen email={email} onBackToLogin={handleBackToLogin} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{t('auth.welcome')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('auth.enterEmail')}</Text>
        
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.emailInput, { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder={t('auth.emailPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              { backgroundColor: colors.primary },
              isLoading && styles.loginButtonDisabled
            ]} 
            onPress={handleOTPLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? t('auth.sending') : t('auth.sendOTP')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          {t('auth.secureLinkDescription')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
