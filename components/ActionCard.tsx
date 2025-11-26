import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ActionCardProps {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
}

export default function ActionCard({ title, description, icon, onPress }: ActionCardProps) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color="#000000" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        margin: 6,
        minHeight: 160,
        justifyContent: 'space-between',
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontFamily: 'DMSans-Bold',
        color: '#000000',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        fontFamily: 'DMSans-Regular',
        color: '#666666',
        lineHeight: 18,
    },
});
