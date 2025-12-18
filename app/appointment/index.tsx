import ActionCard from '@/components/ActionCard';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy data for appointments
const APPOINTMENTS = [
    {
        id: '1',
        doctor: 'Dr. Sarah Smith',
        specialty: 'Cardiologist',
        date: '2025-12-20',
        time: '10:00 AM',
        status: 'Upcoming',
    },
    {
        id: '2',
        doctor: 'City Health Clinic',
        specialty: 'General Checkup',
        date: '2025-12-15',
        time: '02:30 PM',
        status: 'Completed',
    },
    {
        id: '3',
        doctor: 'Dr. John Doe',
        specialty: 'Dentist',
        date: '2025-11-28',
        time: '09:00 AM',
        status: 'Completed',
    },
];

export default function AppointmentsScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();

    const renderAppointmentItem = ({ item }: { item: typeof APPOINTMENTS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.doctorName}>{item.doctor}</Text>
                    <Text style={styles.specialty}>{item.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'Completed' ? styles.statusCompleted : styles.statusUpcoming]}>
                    <Text style={[styles.statusText, item.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextUpcoming]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.dateTimeContainer}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.dateTimeText}>{item.date}</Text>
                </View>
                <View style={styles.dateTimeContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.dateTimeText}>{item.time}</Text>
                </View>
            </View>
        </View>
    );

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
                        <ActionCard
                            title="New Appointment"
                            description="Book a new consultation"
                            icon="add-circle-outline" // Changed to a valid icon name
                            onPress={() => router.push('/appointment/create')}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Your Appointments</Text>

                    <FlatList
                        data={APPOINTMENTS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAppointmentItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
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
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
        marginBottom: 16,
        marginLeft: 6,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    doctorName: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: '#000000',
        marginBottom: 4,
    },
    specialty: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        color: '#666666',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusUpcoming: {
        backgroundColor: '#E8F5E9',
    },
    statusCompleted: {
        backgroundColor: '#F5F5F5',
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'DMSans-Bold',
    },
    statusTextUpcoming: {
        color: '#2E7D32',
    },
    statusTextCompleted: {
        color: '#757575',
    },
    cardFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 12,
        gap: 16,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateTimeText: {
        fontSize: 13,
        fontFamily: 'DMSans-Regular',
        color: '#444444',
    },
});
