import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const maskedEmail = email
    ? `${email.substring(0, 2)}******`
    : 'di******';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(63); // 1:03 in seconds
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 3) {
      const fullOtp = [...newOtp];
      fullOtp[index] = value;
      if (fullOtp.every((digit) => digit !== '')) {
        handleVerify(fullOtp.join(''));
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 4) return;

    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/setup-profile');
    }, 1500);
  };

  const handleResendCode = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setTimer(63);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {isVerifying ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingCircle}>
              <ActivityIndicator size="large" color="#009321" />
            </View>
            <Text style={styles.loadingText}>Validating code</Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              Enter the code we sent to email {maskedEmail}
            </Text>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!isResending}
                />
              ))}
            </View>
          </View>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendQuestion}>
              Didn't receive a verification code?
            </Text>
            {timer > 0 ? (
              <Text style={styles.resendTimer}>
                You can request a new code in {formatTimer(timer)}
              </Text>
            ) : (
              <Pressable onPress={handleResendCode} disabled={isResending}>
                <Text style={styles.resendLink}>
                  {isResending ? 'Sending...' : 'Request new code'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Continue Button */}
          {isOtpComplete && (
            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleVerify()}
                accessibilityLabel="Continue"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
    paddingTop: 61,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 147, 33, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
  },
  titleSection: {
    marginBottom: 56,
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
  otpSection: {
    marginBottom: 48,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  otpInput: {
    width: 44,
    height: 48,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    marginBottom: 16,
  },
  resendTimer: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(26, 26, 26, 0.6)',
  },
  resendLink: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#009321',
    textDecorationLine: 'underline',
  },
  buttonSection: {
    marginTop: 'auto',
    marginBottom: 34,
  },
  button: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#009321',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'DMSans-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    letterSpacing: 0.28,
  },
});


