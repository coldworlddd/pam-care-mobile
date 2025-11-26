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
            Continue With Email
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
            Continue With Google
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 80,
    width: '100%',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  titleGradient: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'DMSans-Bold',
    letterSpacing: -0.5,
    color: '#1B4D3E', // Darker green from design
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'DMSans-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  buttonsSection: {
    width: '100%',
    gap: 16,
    marginBottom: 60,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    color: '#EA4335', // Google Red
  },
  legalSection: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  legalText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    textAlign: 'center',
  },
  legalLink: {
    color: '#2F9F4C', // Green link color
    fontFamily: 'DMSans-Medium',
  },
});

