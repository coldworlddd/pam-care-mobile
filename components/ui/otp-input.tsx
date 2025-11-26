import { useThemeContext } from '@/contexts/themeContext';
import React, { forwardRef, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export interface OTPInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  /**
   * Number of OTP digits
   */
  length?: number;
  /**
   * Current OTP value as array of strings
   */
  value: string[];
  /**
   * Callback when OTP changes
   */
  onOtpChange: (otp: string[]) => void;
  /**
   * Callback when OTP is complete
   */
  onOtpComplete?: (otp: string) => void;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}

/**
 * OTP Input component for verification codes
 * 
 * @example
 * ```tsx
 * <OTPInput
 *   length={4}
 *   value={otp}
 *   onOtpChange={setOtp}
 *   onOtpComplete={(code) => handleVerify(code)}
 * />
 * ```
 */
export const OTPInput = forwardRef<View, OTPInputProps>(
  (
    {
      length = 4,
      value,
      onOtpChange,
      onOtpComplete,
      disabled = false,
      ...textInputProps
    },
    ref
  ) => {
    const { theme } = useThemeContext();
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Initialize value array if needed
    const otpArray = value.length === length ? value : Array(length).fill('');

    const handleOtpChange = (text: string, index: number) => {
      // Only allow single digit
      if (text.length > 1) return;

      const newOtp = [...otpArray];
      newOtp[index] = text;
      onOtpChange(newOtp);

      // Auto-focus next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (text && index === length - 1) {
        const fullOtp = [...newOtp];
        fullOtp[index] = text;
        if (fullOtp.every((digit) => digit !== '') && onOtpComplete) {
          onOtpComplete(fullOtp.join(''));
        }
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <View ref={ref} style={styles.container}>
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(inputRef) => {
              inputRefs.current[index] = inputRef;
            }}
            style={[
              styles.otpInput,
              {
                backgroundColor: '#F9FAFB',
                opacity: disabled ? 0.6 : 1,
              },
            ]}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
            {...textInputProps}
          />
        ))}
      </View>
    );
  }
);

OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    backgroundColor: '#F9FAFB',
  },
});

