import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useThemeContext } from '@/contexts/themeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '@/api/client';

export default function AuthEmailScreen() {
  const router = useRouter();
  const { theme } = useThemeContext()
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/send-otp', { email });
      console.log({ data })
      router.push({
        pathname: '/verify-otp',
        params: { email: email },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgottenPassword = () => {
    // TODO: Implement forgotten password flow
  };

  const isEmailValid = validateEmail(email);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Continue With Email</Text>
          <Text style={styles.subtitle}>Enter your Email to get started</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            error={error}
            disabled={isLoading}
            leftIcon={<MaterialIcons name="mail-outline" size={20} color={theme.colors.black7} />}
            containerStyle={styles.inputContainer}
          />
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            onPress={handleContinue}
            loading={isLoading}
            disabled={isLoading || !email}
            fullWidth
            style={!email ? styles.disabledButton : undefined}
            textStyle={!email ? styles.disabledButtonText : undefined}
          >
            Continue
          </Button>

          <Button
            variant="text"
            onPress={handleForgottenPassword}
            style={styles.forgotPasswordButton}
            textStyle={styles.forgotPasswordText}
          >
            Forgotten Password
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  titleSection: {
    marginBottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    // Custom style to match the design's green border if needed, 
    // but Input component handles border color. 
    // We might need to rely on focus state or modify Input component for static border.
  },
  buttonSection: {
    gap: 16,
    alignItems: 'center',
    justifyContent: "center"
  },
  disabledButton: {
    backgroundColor: '#F5F7F7',
    opacity: 1, // Override default disabled opacity
  },
  disabledButtonText: {
    color: '#A0A0A0',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    height: 'auto',
    paddingVertical: 0,
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
  },
});


