import { api } from '@/api/client';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppointmentsScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointment');
            // Assuming response.data is the array of appointments
            setAppointments(response.data || []);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
    };

    const getBadgeColor = (status: string) => {
        const color = theme.colors.primary || '#009321';

        switch (status) {
            case 'Upcoming':
            case 'scheduled':
                return { bg: `${color}20`, text: color };
            case 'Completed':
            case 'completed':
                return { bg: '#F5F5F5', text: '#666666' };
            case 'cancelled':
                return { bg: '#FFEBEE', text: '#B71C1C' };
            default:
                return { bg: `${color}20`, text: color };
        }
    };

    const renderAppointmentItem = ({ item }: { item: any }) => {
        const badgeColors = getBadgeColor(item.status);

        // Parse date and time
        const dateObj = new Date(item.appointment_date);
        const day = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Parse reason for Doctor Name and Reason
        let doctorName = 'Practitioner';
        let reason = item.reason;

        if (item.reason?.startsWith('Doctor: ')) {
            const parts = item.reason.split('\n\nNote: ');
            doctorName = parts[0].replace('Doctor: ', '');
            reason = parts[1] || '';
        }

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={[styles.badgeContainer, { backgroundColor: badgeColors.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeColors.text }]}>
                            {item?.status ? item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) : 'Ongoing'}
                        </Text>
                    </View>
                    <Pressable style={styles.menuButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color="#CCCCCC" />
                    </Pressable>
                </View>

                <Text style={styles.doctorName}>{doctorName}</Text>

                <View style={styles.timeContainer}>
                    <Ionicons name="calendar-outline" size={14} color="#999999" style={{ marginRight: 4 }} />
                    <Text style={styles.specialty}>{day} • {time}</Text>
                </View>

                {reason ? (
                    <Text style={[styles.specialty, { marginTop: 8 }]} numberOfLines={2}>{reason}</Text>
                ) : null}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={[theme.colors.gradientShade, theme.colors.gradientTint]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Appointments</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.createButtonContainer}>
                        <TouchableOpacity
                            style={styles.createButtonTouchable}
                            onPress={() => router.push('/appointment/create')}
                            activeOpacity={0.8}
                        >
                            <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                <View style={styles.glassCardContent}>
                                    <Ionicons name="add" size={48} color="#FFFFFF" />
                                    <Text style={styles.glassCardText}>New Appointment</Text>
                                </View>
                            </BlurView>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Your Appointments</Text>

                    {loading ? (
                        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={appointments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderAppointmentItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No appointments found</Text>
                                </View>
                            }
                        />
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 10,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 18,
    },
    createButtonContainer: {
        marginBottom: 20,
        height: 140, // Reduced height for the button
    },
    createButtonTouchable: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 6,
    },
    glassCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fallback/Tint
    },
    glassCardContent: {
        alignItems: 'center',
        gap: 8,
    },
    glassCardText: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
        marginBottom: 16,
        marginLeft: 6,
        marginTop: 20
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: 'DMSans-Bold',
    },
    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorName: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#000000',
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specialty: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        color: '#999999',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'DMSans-Medium',
        color: 'rgba(255,255,255,0.6)',
    },
    // Old styles to remove or keep if needed elsewhere (cleaned up for new design)
});
