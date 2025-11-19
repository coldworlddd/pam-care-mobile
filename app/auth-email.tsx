import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
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
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/verify-otp',
        params: { email: email },
      });
    }, 1000);
  };

  const handleForgottenPassword = () => {
    // TODO: Implement forgotten password flow
  };

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
            placeholder="Email"
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
          />
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            onPress={handleContinue}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            Continue
          </Button>

          <Button
            variant="text"
            onPress={handleForgottenPassword}
            style={styles.forgotPasswordButton}
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
    paddingHorizontal: 16,
    paddingTop: 61,
  },
  titleSection: {
    marginBottom: 84,
    maxWidth: 280,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    letterSpacing: -0.36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(26, 26, 26, 0.6)',
  },
  inputSection: {
    marginBottom: 60,
  },
  buttonSection: {
    gap: 24,
  },
  forgotPasswordButton: {
    alignItems: 'center',
  },
});


