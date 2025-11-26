import { BlurView } from 'expo-blur';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GlassPillProps {
  label: string;
  onPress?: () => void;
}

export default function GlassPill({ label, onPress }: GlassPillProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <Text style={styles.text}>{label}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
  },
  blur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
  },
});
