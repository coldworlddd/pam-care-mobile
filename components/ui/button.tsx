import { useThemeContext } from '@/contexts/themeContext';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button text content
   */
  children: React.ReactNode;
  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Whether the button is disabled
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
   * Whether the button should take full width
   */
  fullWidth?: boolean;
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  /**
   * Custom button style
   */
  style?: ViewStyle;
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
}

/**
 * Professional Button component following the design system
 * 
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   onPress={handlePress}
 *   loading={isLoading}
 * >
 *   Continue
 * </Button>
 * ```
 */
export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  containerStyle,
  style,
  textStyle,
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  ...pressableProps
}: ButtonProps) {
  const { theme } = useThemeContext();
  const isDisabled = disabled || loading;

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 32,
          paddingHorizontal: 10,
          fontSize: 12,
          gap: 6,
        };
      case 'large':
        return {
          height: 48,
          paddingHorizontal: 16,
          fontSize: 16,
          gap: 10,
        };
      default:
        return {
          height: 50,
          paddingHorizontal: 12,
          fontSize: 14,
          gap: 8,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Get variant-based styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary || '#009321',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary || '#F5F5DC',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: theme.colors.black || '#1a1a1a',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: '#9E9E9E',
          borderWidth: 1,
          textColor: theme.colors.black || '#1a1a1a',
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: theme.colors.primary || '#009321',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: theme.colors.black || '#1a1a1a',
        };
      default:
        return {
          backgroundColor: theme.colors.primary || '#009321',
          borderColor: 'transparent',
          borderWidth: 0,
          textColor: '#FFFFFF',
        };
    }
  };

  const variantStyles = getVariantStyles();

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  return (
    <View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        containerStyle,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            height: sizeStyles.height,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
            borderWidth: variantStyles.borderWidth,
            opacity: isDisabled ? 0.6 : pressed ? 0.8 : 1,
          },
          style,
        ]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        {...pressableProps}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles.textColor}
            size={size === 'small' ? 'small' : 'small'}
          />
        ) : (
          <>
            {leftIcon && (
              <View style={[styles.iconContainer, { marginRight: sizeStyles.gap / 2 }]}>
                {leftIcon}
              </View>
            )}
            <Text
              style={[
                styles.text,
                variant === 'text' && styles.textVariant,
                {
                  fontSize: sizeStyles.fontSize,
                  color: variantStyles.textColor,
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
            {rightIcon && (
              <View style={[styles.iconContainer, { marginLeft: sizeStyles.gap / 2 }]}>
                {rightIcon}
              </View>
            )}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  text: {
    fontFamily: 'DMSans-SemiBold',
    // lineHeight: 14,
    textTransform: 'capitalize',
    letterSpacing: 0.28,
    textAlign: 'center',
  },
  textVariant: {
    fontFamily: 'DMSans-Regular',
    textTransform: 'none',
    letterSpacing: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

