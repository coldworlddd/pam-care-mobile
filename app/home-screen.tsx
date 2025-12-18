import { api } from '@/api/client';
import ActionCard from '@/components/ActionCard';
import GlassInput from '@/components/GlassInput';
import GlassPill from '@/components/GlassPill';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();
    const [firstName, setFirstName] = useState('User');
    const [refreshing, setRefreshing] = useState(false);

    const getUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            console.log("userdata ", userData);
            if (userData) {
                const { first_name } = JSON.parse(userData);
                if (first_name) {
                    setFirstName(first_name);
                }
            } else {
                try {
                    const response = await api.get('/auth/me');
                    const user = response.data;
                    console.log("user ", user);
                    if (user) {
                        setFirstName(user.first_name || '');
                        console.log(user);
                        // Optionally update AsyncStorage here too
                        await AsyncStorage.setItem('userData', JSON.stringify(user));
                    }
                } catch (error) {
                    console.log('Failed to fetch user details', error);
                }
            }
        } catch (e) {
            console.log('Failed to load user data');
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getUser();
        setRefreshing(false);
    }, []);

    const commonConditions = [
        'High BP',
        'Diabetes',
        'Pregnancy',
        'Chills / Shivering',
        'Headache',
    ];

    return (
        <LinearGradient
            colors={[theme.colors.gradientShade, theme.colors.gradientTint]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logoText}>PamCare AI</Text>
                        <View style={styles.headerIcons}>
                            <Pressable style={styles.iconButton}>
                                <Ionicons name="notifications" size={24} color="#FFFFFF" />
                            </Pressable>
                            <Pressable style={styles.iconButton}>
                                <Ionicons name="menu" size={24} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingTitle}>Hello {firstName},</Text>
                        <Text style={styles.greetingSubtitle}>How are you today?</Text>
                    </View>

                    {/* Common Conditions */}
                    <View style={styles.conditionsContainer}>
                        <Text style={styles.sectionTitle}>Select Common conditions</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                            {commonConditions.map((condition, index) => (
                                <GlassPill key={index} label={condition} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Action Grid */}
                    <View style={styles.gridContainer}>
                        <View style={styles.row}>
                            <ActionCard
                                title="Book Appointment"
                                description="Schedule a visit with a clinic or doctor."
                                icon="calendar-outline"
                                onPress={() => router.push('/appointment')}
                            />
                            <ActionCard
                                title="Patient Report"
                                description="View your symptoms, health summary."
                                icon="document-text-outline"
                            />
                        </View>
                        <View style={styles.row}>
                            <ActionCard
                                title="Pharmacy"
                                description="See medication info and recommended options."
                                icon="medkit-outline"
                            />
                            <ActionCard
                                title="Emergency"
                                description="Get immediate emergency contacts."
                                icon="pulse-outline"
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Input */}
                <View style={styles.bottomInputContainer}>
                    <TouchableOpacity onPress={() => router.push('/chat')}>
                        <GlassInput onPress={() => router.push('/chat')} />
                    </TouchableOpacity>
                </View>
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
    scrollContent: {
        paddingBottom: 100, // Space for bottom input
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        marginBottom: 30,
    },
    logoText: {
        fontSize: 20,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    greetingContainer: {
        paddingHorizontal: 24,
        marginBottom: 70,
    },
    greetingTitle: {
        fontSize: 32,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    greetingSubtitle: {
        fontSize: 32,
        fontFamily: 'DMSans-Bold',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    conditionsContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
        marginLeft: 24,
        marginBottom: 16,
    },
    pillsScroll: {
        paddingLeft: 24,
    },
    gridContainer: {
        paddingHorizontal: 18,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    bottomInputContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
});
