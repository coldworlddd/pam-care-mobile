import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="rgba(26, 26, 26, 0.4)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
            accessibilityLabel="Continue"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <Pressable
            onPress={handleForgottenPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgotten Password</Text>
          </Pressable>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'DMSans-Regular',
    color: '#FF3B30',
    marginTop: 4,
  },
  buttonSection: {
    gap: 24,
  },
  button: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#009321',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    letterSpacing: 0.28,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#009321',
  },
});


