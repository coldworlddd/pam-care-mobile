import { useThemeContext } from '@/contexts/themeContext';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

export interface InputProps extends TextInputProps {
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message. When provided, the input will show error styling
   */
  error?: string;
  /**
   * Success message. When provided, the input will show success styling
   */
  success?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Left icon component
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon component
   */
  rightIcon?: React.ReactNode;
  /**
   * Container style
   */
  containerStyle?: ViewStyle;
  /**
   * Input variant
   */
  variant?: 'default' | 'error' | 'success';
  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show focus state
   */
  showFocusState?: boolean;
  /**
   * Validation function or regex pattern
   */
  validate?: ((value: string) => boolean) | RegExp;
  /**
   * Error message to display when validation fails
   */
  errorMessage?: string;
}

/**
 * Professional Input component following the design system
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   validate={(val) => val.includes('@')}
 *   errorMessage="Invalid email"
 * />
 * ```
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      disabled = false,
      leftIcon,
      rightIcon,
      containerStyle,
      variant,
      size = 'medium',
      showFocusState = true,
      style,
      placeholderTextColor,
      onFocus,
      onBlur,
      validate,
      errorMessage,
      onChangeText,
      ...textInputProps
    },
    ref
  ) => {
    const { theme } = useThemeContext();
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState('');
    const [internalSuccess, setInternalSuccess] = useState(false);

    const handleValidation = (text: string) => {
      if (!validate) return;

      let isValid = false;
      if (typeof validate === 'function') {
        isValid = validate(text);
      } else if (validate instanceof RegExp) {
        isValid = validate.test(text);
      }

      if (text.length > 0) {
        if (isValid) {
          setInternalError('');
          setInternalSuccess(true);
        } else {
          setInternalError(errorMessage || 'Invalid input');
          setInternalSuccess(false);
        }
      } else {
        setInternalError('');
        setInternalSuccess(false);
      }
    };

    const handleChangeText = (text: string) => {
      setTouched(true);
      onChangeText?.(text);
      handleValidation(text);
    };

    const hasError = Boolean(error) || Boolean(internalError) || variant === 'error';
    const hasSuccess = Boolean(success) || internalSuccess || variant === 'success';
    const isDisabled = disabled || textInputProps.editable === false;

    // Determine border color based on state
    const getBorderColor = () => {
      if (hasError) return theme.colors.failed || '#FF3B30';
      if (hasSuccess) return theme.colors.success || '#188754';
      if (isFocused && showFocusState) return theme.colors.primary || '#009321';
      if (isDisabled) return 'rgba(158, 158, 158, 0.3)';
      return '#E2E8F0';
    };

    const getAccentColor = () => {
      if (hasError) return theme.colors.failed || '#FF3B30';
      if (hasSuccess) return theme.colors.success || '#188754';
      if (isFocused && showFocusState) return theme.colors.primary || '#009321';
      if (isDisabled) return 'rgba(158, 158, 158, 0.3)';
      return '';
    };

    const toRgba = (color: string, alpha: number) => {
      if (!color) return 'transparent';
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const expandedHex =
          hex.length === 3
            ? hex
              .split('')
              .map((char) => `${char}${char}`)
              .join('')
            : hex;
        const bigint = parseInt(expandedHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      if (color.startsWith('rgb')) {
        const values = color
          .replace(/[rgba()]/g, '')
          .split(',')
          .map((value) => value.trim());
        const [r = '0', g = '0', b = '0'] = values;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return color;
    };

    // Determine placeholder color
    const getPlaceholderColor = () => {
      if (placeholderTextColor) return placeholderTextColor;
      return theme.colors.placeholder || 'rgba(26, 26, 26, 0.4)';
    };

    // Determine text color
    const getTextColor = () => {
      if (isDisabled) return theme.colors.textLight || 'rgba(26, 26, 26, 0.4)';
      return theme.colors.black || '#000000';
    };

    // Determine background color
    const getBackgroundColor = () => {
      if (isDisabled) return 'rgba(245, 247, 247, 0.5)';
      return theme.colors.inputBackground || '#FFFFFF';
    };

    // Get size-based styles
    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return { height: 36, fontSize: 14, paddingHorizontal: 12 };
        case 'large':
          return { height: 52, fontSize: 18, paddingHorizontal: 20 };
        default:
          return { height: 50, fontSize: 14, paddingHorizontal: 16 };
      }
    };

    const sizeStyles = getSizeStyles();

    const handleFocus = (e: any) => {
      setIsFocused(true);
      // onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const accentColor = getAccentColor();
    const accentBackgroundColor =
      accentColor && accentColor !== 'rgba(158, 158, 158, 0.3)'
        ? toRgba(accentColor, 0.12)
        : accentColor
          ? toRgba(accentColor, 0.08)
          : 'transparent';

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.black,
                fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
                marginBottom: size === 'small' ? 6 : size === 'large' ? 10 : 8,
              },
            ]}
          >
            {label}
          </Text>
        )}


        <View
          style={[
            styles.accentWrapper,
            {
              backgroundColor: accentBackgroundColor,
              padding: accentColor ? 5 : 0,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: getBorderColor(),
                backgroundColor: getBackgroundColor(),
                opacity: isDisabled ? 0.6 : 1,
                height: sizeStyles.height,
                borderWidth: isFocused && showFocusState ? 1.5 : 1,
              },
              hasError && styles.inputWrapperError,
              hasSuccess && styles.inputWrapperSuccess,
              isFocused && showFocusState && styles.inputWrapperFocused,
            ]}
          >
            {leftIcon && (
              <View
                style={[
                  styles.leftIconContainer,
                  {
                    paddingLeft: sizeStyles.paddingHorizontal,
                    paddingRight: 8,
                  },
                ]}
              >
                {leftIcon}
              </View>
            )}

            <TextInput
              ref={ref}
              style={[
                styles.input,
                {
                  color: getTextColor(),
                  fontSize: sizeStyles.fontSize,
                  paddingLeft: leftIcon ? 8 : sizeStyles.paddingHorizontal,
                  paddingRight: rightIcon ? 8 : sizeStyles.paddingHorizontal,
                  minHeight: sizeStyles.height,
                },
                style,
              ]}
              placeholderTextColor={getPlaceholderColor()}
              editable={!isDisabled}
              // onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              {...textInputProps}
            />

            {rightIcon && (
              <View
                style={[
                  styles.rightIconContainer,
                  {
                    paddingRight: sizeStyles.paddingHorizontal,
                    paddingLeft: 8,
                  },
                ]}
              >
                {rightIcon}
              </View>
            )}
          </View>
        </View>

        {(error || internalError || success || internalSuccess || helperText) && (
          <View style={styles.helperContainer}>
            {error || internalError ? (
              <Text
                style={[
                  styles.errorText,
                  {
                    color: theme.colors.failed || '#FF3B30',
                    fontSize: size === 'small' ? 11 : 12,
                  },
                ]}
              >
                {error || internalError}
              </Text>
            ) : success || internalSuccess ? (
              <Text
                style={[
                  styles.successText,
                  {
                    color: theme.colors.success || '#188754',
                    fontSize: size === 'small' ? 11 : 12,
                  },
                ]}
              >
                {success}
              </Text>
            ) : (
              helperText && (
                <Text
                  style={[
                    styles.helperText,
                    {
                      color: theme.colors.textLight || 'rgba(26, 26, 26, 0.6)',
                      fontSize: size === 'small' ? 11 : 12,
                    },
                  ]}
                >
                  {helperText}
                </Text>
              )
            )}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Medium',
    marginBottom: 8,
    color: '#000000',
  },
  accentWrapper: {
    borderRadius: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // transition: 'border-color 0.2s ease',
  },
  inputWrapperFocused: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperError: {
    borderWidth: 1,
  },
  inputWrapperSuccess: {
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#000000',
    backgroundColor: "transparent"
  },
  leftIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperContainer: {
    marginTop: 4,
    minHeight: 16,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(26, 26, 26, 0.6)',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'DMSans-Regular',
    color: '#FF3B30',
  },
  successText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'DMSans-Regular',
    color: '#188754',
  },
});

