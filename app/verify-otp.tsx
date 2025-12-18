import { OTPInput } from '@/components/ui/otp-input';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '@/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 4) return;

    setIsVerifying(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, code });

      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        if (response.data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        router.replace('/home-screen');
      } else {
        router.push({ pathname: '/setup-profile', params: { email } });
      }

    } catch (error: any) {
      alert(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      await api.post('/auth/send-otp', { email });
      setTimer(63);
      setOtp(['', '', '', '']);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
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
            <OTPInput
              length={4}
              value={otp}
              onOtpChange={setOtp}
              onOtpComplete={(code) => handleVerify(code)}
              disabled={isResending}
            />
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
          {/* <View style={styles.buttonSection}>
            <Button
              variant="primary"
              onPress={() => handleVerify()}
              fullWidth
              disabled={!isOtpComplete}
              style={!isOtpComplete ? styles.disabledButton : undefined}
              textStyle={!isOtpComplete ? styles.disabledButtonText : undefined}
            >
              Continue
            </Button>
          </View> */}
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
    paddingHorizontal: 24,
    paddingTop: 80,
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
    marginBottom: 40,
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
  otpSection: {
    marginBottom: 40,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#666666',
    marginBottom: 16,
  },
  resendTimer: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#666666',
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
  disabledButton: {
    backgroundColor: '#F5F7F7',
    opacity: 1,
  },
  disabledButtonText: {
    color: '#A0A0A0',
  },
});


