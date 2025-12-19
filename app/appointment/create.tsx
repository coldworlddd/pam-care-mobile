import { api } from '@/api/client';
import { useThemeContext } from '@/contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const AMPM = ['AM', 'PM'];

export default function CreateAppointmentScreen() {
    const { theme } = useThemeContext();
    const router = useRouter();

    // Form state
    const [selectedDay, setSelectedDay] = useState('6');
    const [selectedMonth, setSelectedMonth] = useState('06');
    const [selectedHour, setSelectedHour] = useState('8');
    const [selectedMinute, setSelectedMinute] = useState('59');
    const [selectedAmPm, setSelectedAmPm] = useState('AM');

    const [doctorName, setDoctorName] = useState('Dr John Doe');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {

        setLoading(true);
        try {
            // Construct Date object
            // Note: This construction is simplistic and assumes the current year.
            // A more robust solution would handle years and validated days per month.
            const year = new Date().getFullYear();
            let hours = parseInt(selectedHour);
            if (selectedAmPm === 'PM' && hours !== 12) hours += 12;
            if (selectedAmPm === 'AM' && hours === 12) hours = 0;

            const date = new Date(year, parseInt(selectedMonth) - 1, parseInt(selectedDay), hours, parseInt(selectedMinute));

            await api.post('/appointment', {
                appointment_date: date.toISOString(),
                reason: `Doctor: ${doctorName}\n\nNote: ${note}`,
            });

            Toast.show({
                type: 'success',
                text1: 'Appointment Created',
            });

            // Small delay to show success
            setTimeout(() => {
                router.back();
            }, 500);

        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Failed to create appointment',
            });
        } finally {
            setLoading(false);
        }
    };

    const PickerColumn = ({ items, selected, onSelect, label }: any) => (
        <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabel}>{label}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll} contentContainerStyle={styles.pickerScrollContent}>
                {items.map((item: string, index: number) => {
                    const isSelected = item === selected;
                    return (
                        <Pressable key={index} onPress={() => onSelect(item)} style={styles.pickerItem}>
                            <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                                {item}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <LinearGradient
            colors={[theme.colors.gradientShade, theme.colors.gradientTint]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <View style={[styles.container]}>
                <SafeAreaView edges={['top']} style={styles.headerSafe}>
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </Pressable>
                        <View style={styles.doctorHeaderInfo}>
                            {doctorName ? (
                                <View style={styles.doctorHeaderTextContainer}>
                                    <Text style={styles.doctorHeaderName}>{doctorName}</Text>
                                    <Text style={styles.doctorHeaderSubtitle}>Practitioner</Text>
                                </View>
                            ) : null}
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={require('../../assets/images/dr.jpeg')}
                                    style={styles.profileImage}
                                />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.screenTitle}>Create Appointment</Text>
                </SafeAreaView>

                <View style={styles.contentContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* Date and Time Picker */}
                        <Text style={styles.sectionTitle}>Date and Time</Text>
                        <View style={styles.pickerContainer}>
                            <PickerColumn items={DAYS} selected={selectedDay} onSelect={setSelectedDay} label="Day" />
                            <PickerColumn items={MONTHS} selected={selectedMonth} onSelect={setSelectedMonth} label="Month" />
                            <PickerColumn items={HOURS} selected={selectedHour} onSelect={setSelectedHour} label="Hour" />
                            <PickerColumn items={MINUTES} selected={selectedMinute} onSelect={setSelectedMinute} label="Minute" />
                            <PickerColumn items={AMPM} selected={selectedAmPm} onSelect={setSelectedAmPm} label="" />
                        </View>

                        {/* Note Input */}
                        <Text style={styles.sectionTitle}>Reason</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Write your important note"
                                placeholderTextColor="#CCCCCC"
                                value={note}
                                onChangeText={setNote}
                                multiline
                            />
                        </View>

                        {/* Save Button */}
                        <View style={styles.footer}>

                            <Pressable
                                style={styles.saveButton}
                                onPress={loading ? undefined : handleCreate}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </Pressable>
                        </View>

                    </ScrollView>
                </View>
                <StatusBar style="light" />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSafe: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        padding: 4,
    },
    doctorHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    doctorHeaderTextContainer: {
        alignItems: 'flex-end',
    },
    doctorHeaderName: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    doctorHeaderSubtitle: {
        fontSize: 12,
        fontFamily: 'DMSans-Medium',
        color: 'rgba(255,255,255,0.7)',
    },
    profileImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: '#333333',
        marginBottom: 12,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    pickerColumn: {
        alignItems: 'center',
        width: 40,
    },
    pickerLabel: {
        fontSize: 10,
        fontFamily: 'DMSans-Medium',
        color: '#666666',
        marginBottom: 8,
    },
    pickerScroll: {
        height: 120, // Visible height
    },
    pickerScrollContent: {
        alignItems: 'center',
    },
    pickerItem: {
        paddingVertical: 8,
    },
    pickerItemText: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        color: '#AAAAAA',
    },
    pickerItemTextSelected: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#fff',
        backgroundColor: '#009321dd',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 8,
    },
    inputContainer: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
    },
    input: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        color: '#333333',
    },
    textAreaContainer: {
        height: 200,
        paddingVertical: 12,
    },
    textArea: {
        height: '100%',
        textAlignVertical: 'top', // Android
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 8,
    },
    colorDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#009321', // Yellowish/Orange
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#F5C667',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        color: '#FFFFFF',
    },
});
