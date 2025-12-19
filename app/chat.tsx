import { api } from '@/api/client';
import GlassInput from '@/components/GlassInput';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([
        { id: 1, text: 'Hello! I am your PamCare AI assistant. How can I help you today?', isUser: false },
    ]);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = message.trim();
        const newMsg = { id: Date.now(), text: userMsg, isUser: true };

        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post('/chat', { message: userMsg });

            if (response.data && response.data.aiResponse) {
                const aiMsg = {
                    id: Date.now() + 1,
                    text: response.data.aiResponse,
                    isUser: false
                };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = {
                id: Date.now() + 1,
                text: 'Sorry, I encountered an error. Please try again.',
                isUser: false
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

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
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                >
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
                            <View style={[
                                styles.messageBubble,
                                msg.isUser ? styles.userBubble : styles.aiBubble
                            ]}>
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                        </View>
                    ))}
                    {loading && (
                        <View style={styles.aiMessageRow}>
                            <View style={styles.avatarContainer}>
                                <Ionicons name="logo-electron" size={24} color="#000000" />
                            </View>
                            <View style={[styles.messageBubble, styles.aiBubble, { paddingVertical: 12 }]}>
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            </View>
                        </View>
                    )}
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
                            onSend={handleSend}
                            editable={!loading}
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
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderTopRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderTopLeftRadius: 4,
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
