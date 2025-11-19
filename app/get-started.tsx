import { Button } from '@/components/ui/button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GetStartedScreen() {
  const router = useRouter();

  const handleEmailPress = () => {
    // Navigate to email authentication screen
    router.push('/auth-email' as any); // Type assertion needed until Expo Router generates types
  };

  const handleGooglePress = () => {
    // TODO: Implement Google authentication
    router.replace('/(tabs)');
  };

  const handleTermsPress = () => {
    // TODO: Navigate to terms & conditions
    Linking.openURL('https://example.com/terms');
  };

  const handlePrivacyPress = () => {
    // TODO: Navigate to privacy policy
    Linking.openURL('https://example.com/privacy');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Welcome to{' '}
            <Text style={styles.titleGradient}>PamCare AI</Text>
          </Text>
          <Text style={styles.subtitle}>
            Reimagine healthcare with empathy and intelligence
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          <Button
            variant="primary"
            onPress={handleEmailPress}
            fullWidth
            leftIcon={<MaterialIcons name="email" size={24} color="#FFFFFF" />}
          >
            Continue with Email
          </Button>

          <Button
            variant="outline"
            onPress={handleGooglePress}
            fullWidth
            leftIcon={
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
            }
          >
            Continue with Google
          </Button>
        </View>

        {/* Legal Text */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            If you sign up,{' '}
            <Text style={styles.legalLink} onPress={handleTermsPress}>
              Terms & Conditions
            </Text>
            {' '}and{' '}
            <Text style={styles.legalLink} onPress={handlePrivacyPress}>
              Privacy policy
            </Text>
            {' '}apply.
          </Text>
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
    paddingHorizontal: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
    maxWidth: 280,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.36,
    marginBottom: 12,
  },
  titleGradient: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'DMSans-Bold',
    letterSpacing: -0.36,
    color: '#009321',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(26, 26, 26, 0.6)',
    textAlign: 'center',
  },
  buttonsSection: {
    width: '100%',
    maxWidth: 347,
    gap: 14,
    marginBottom: 60,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  googleIconText: {
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
    color: '#4285F4',
    fontWeight: 'bold',
  },
  legalSection: {
    width: '100%',
    maxWidth: 241,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'DMSans-Medium',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  legalLink: {
    color: '#009321',
    textDecorationLine: 'underline',
  },
});

