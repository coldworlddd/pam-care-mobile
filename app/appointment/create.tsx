import GlassInput from '@/components/GlassInput';
import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateAppointmentScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();

    // Form state
    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1500);
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
                    <Text style={styles.headerTitle}>New Appointment</Text>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Doctor or Clinic Name</Text>
                            <GlassInput
                                placeholder="e.g. Dr. Smith or City Clinic"
                                value={doctorName}
                                onChangeText={setDoctorName}
                                variant="default"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.formGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Date</Text>
                                <GlassInput
                                    placeholder="YYYY-MM-DD"
                                    value={date}
                                    onChangeText={setDate}
                                    variant="default"
                                />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={[styles.formGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Time</Text>
                                <GlassInput
                                    placeholder="HH:MM AM/PM"
                                    value={time}
                                    onChangeText={setTime}
                                    variant="default"
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Reason for Visit</Text>
                            <GlassInput
                                placeholder="e.g. Annual Checkup, Fever..."
                                value={reason}
                                onChangeText={setReason}
                                variant="default"
                            />
                        </View>

                        <View style={styles.footer}>
                            <Button
                                variant="primary"
                                fullWidth
                                onPress={handleCreate}
                                loading={loading}
                                disabled={!doctorName || !date || !time}
                            >
                                Confirm Booking
                            </Button>
                        </View>
                    </ScrollView>
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'DMSans-Medium',
        color: '#FFFFFF',
        marginBottom: 8,
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        marginTop: 20,
    },
});
