import { useThemeContext } from '@/contexts/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/get-started');
    }, 1600);

    return () => clearTimeout(timeout);
  }, [router]);

  const circles = useMemo(
    () => [
      {
        style: styles.circlePrimary,
      },
      {
        style: styles.circleSecondary,
      },
    ],
    []
  );

  const handleContinue = () => {
    router.replace('/get-started');
  };

  const { theme } = useThemeContext()
  return (
    <LinearGradient
      colors={[theme.colors.gradientShade, theme.colors.gradientTint]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {circles.map((circle, index) => (
        <View key={index} pointerEvents="none" style={[styles.circleBase, circle.style]} />
      ))}

      <Pressable
        accessibilityLabel="Continue to get started"
        accessibilityRole="button"
        onPress={handleContinue}
        style={styles.titleWrapper}
      >
        <Text style={styles.title}>PamCare AI</Text>
      </Pressable>
    </LinearGradient>
  );
}

const BASE_CIRCLE_SIZE = width * 1.78;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.48,
  },
  circleBase: {
    position: 'absolute',
    width: BASE_CIRCLE_SIZE,
    height: BASE_CIRCLE_SIZE,
    borderRadius: BASE_CIRCLE_SIZE / 2,
    // backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 60,
  },
  circlePrimary: {
    top: height * 0.22,
    left: -BASE_CIRCLE_SIZE * 0.55,
  },
  circleSecondary: {
    top: height * 0.5,
    left: -BASE_CIRCLE_SIZE * 0.18,
  },
});

