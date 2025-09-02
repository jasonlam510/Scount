import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme, useI18n } from '../../hooks';

interface EditProfileModalProps {
  visible: boolean;
  field: 'name' | 'nickname';
  currentValue: string;
  onSave: (value: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  field,
  currentValue,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [value, setValue] = useState(currentValue);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset value when modal opens
  useEffect(() => {
    if (visible) {
      setValue(currentValue);
      setIsValid(true);
      setErrorMessage('');
    }
  }, [visible, currentValue]);

  // Validation logic
  const validateInput = (input: string): { isValid: boolean; error: string } => {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      return {
        isValid: false,
        error: field === 'name' ? t('profile.validation.nameRequired') : t('profile.validation.nicknameRequired')
      };
    }
    
    if (trimmedInput.length < 2) {
      return {
        isValid: false,
        error: field === 'name' ? t('profile.validation.nameTooShort') : t('profile.validation.nicknameTooShort')
      };
    }
    
    if (trimmedInput.length > 50) {
      return {
        isValid: false,
        error: field === 'name' ? t('profile.validation.nameTooLong') : t('profile.validation.nicknameTooLong')
      };
    }
    
    return { isValid: true, error: '' };
  };

  const handleInputChange = (text: string) => {
    setValue(text);
    const validation = validateInput(text);
    setIsValid(validation.isValid);
    setErrorMessage(validation.error);
  };

  const handleSave = async () => {
    const trimmedValue = value.trim();
    const validation = validateInput(trimmedValue);
    
    if (!validation.isValid) {
      setIsValid(false);
      setErrorMessage(validation.error);
      return;
    }

    if (trimmedValue === currentValue) {
      // No changes made, just close
      onCancel();
      return;
    }

    try {
      await onSave(trimmedValue);
    } catch (error) {
      Alert.alert(
        t('profile.error.title'),
        t('profile.error.updateFailed'),
        [{ text: t('common.ok') }]
      );
    }
  };

  const getTitle = () => {
    return field === 'name' ? t('profile.editName') : t('profile.editNickname');
  };

  const getPlaceholder = () => {
    return field === 'name' ? t('profile.namePlaceholder') : t('profile.nicknamePlaceholder');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onCancel} disabled={isLoading}>
            <Text style={[styles.cancelButton, { color: colors.primary }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {getTitle()}
          </Text>
          
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={!isValid || isLoading || !value.trim()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[
                styles.saveButton, 
                { 
                  color: (!isValid || !value.trim()) ? colors.textSecondary : colors.primary 
                }
              ]}>
                {t('common.save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Clean text input without container */}
          <TextInput
            style={[
              styles.textInput,
              { 
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: isValid ? colors.border : colors.danger
              }
            ]}
            value={value}
            onChangeText={handleInputChange}
            placeholder={getPlaceholder()}
            placeholderTextColor={colors.textSecondary}
            autoFocus
            maxLength={50}
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            autoCorrect={field === 'name'}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            editable={!isLoading}
          />
          
          {/* Error message */}
          {!isValid && errorMessage && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errorMessage}
            </Text>
          )}
          
          {/* Character counter */}
          <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
            {value.length}/50
          </Text>

          {/* Help Text - Only show for nickname */}
          {field === 'nickname' && (
            <View style={styles.helpContainer}>
              <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                {t('profile.nicknameHelp')}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancelButton: {
    fontSize: 17,
    fontWeight: '400',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    fontSize: 17,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  helpContainer: {
    paddingHorizontal: 4,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EditProfileModal;
