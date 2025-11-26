import GlassInput from '@/components/GlassInput';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();
    const [message, setMessage] = useState('');

    const messages: any[] = [
        // { id: 1, text: 'hi', isUser: true },
        // { id: 2, text: 'Hello! How may I assist you today?', isUser: false },
        // { id: 3, text: 'I have joint pain in my knees', isUser: true },
    ];

    return (
        <LinearGradient
            colors={[theme.colors.gradientShade, theme.colors.gradientTint]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>PamCare AI</Text>
                    <Pressable style={styles.menuButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                    </Pressable>
                </View>

                {/* Chat Area */}
                <ScrollView contentContainerStyle={styles.chatContent}>
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.isUser ? styles.userMessageRow : styles.aiMessageRow,
                            ]}
                        >
                            {!msg.isUser && (
                                <View style={styles.avatarContainer}>
                                    <Ionicons name="logo-electron" size={24} color="#000000" />
                                </View>
                            )}
                            {msg.isUser && (
                                <View style={styles.userAvatarContainer}>
                                    <Ionicons name="person" size={20} color="#FFFFFF" />
                                </View>
                            )}
                            <View style={styles.messageBubble}>
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <View style={styles.inputContainer}>
                        <GlassInput
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <StatusBar style="light" />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    menuButton: {
        padding: 8,
    },
    chatContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 100,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    userMessageRow: {
        flexDirection: 'row-reverse',
    },
    aiMessageRow: {
        flexDirection: 'row',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Placeholder color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userAvatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000000', // Placeholder color
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    messageBubble: {
        maxWidth: '75%',
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'DMSans-Regular',
        color: '#FFFFFF',
        lineHeight: 24,
    },
    inputContainer: {
        paddingBottom: 10,
    },
});
