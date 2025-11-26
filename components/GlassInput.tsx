import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, TextInput } from 'react-native';

interface GlassInputProps {
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
    editable?: boolean;
}

export default function GlassInput({ onPress, value, onChangeText, editable = true }: GlassInputProps) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <BlurView intensity={20} tint="light" style={styles.blur}>
                <Pressable style={styles.iconButton}>
                    <Ionicons name="attach" size={24} color="#FFFFFF" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                    <Ionicons name="mic" size={24} color="#FFFFFF" />
                </Pressable>
                <TextInput
                    style={styles.input}
                    placeholder="Ask anything about your health"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={value}
                    onChangeText={onChangeText}
                    editable={editable && !onPress}
                    pointerEvents={onPress ? 'none' : 'auto'}
                />
                <Pressable style={[styles.iconButton, styles.sendButton]}>
                    <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                </Pressable>
            </BlurView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    blur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontFamily: 'DMSans-Regular',
        fontSize: 16,
        marginLeft: 8,
    },
    sendButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
});
