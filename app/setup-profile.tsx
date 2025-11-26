import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// TODO: Install expo-image-picker: npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';

export default function SetupProfileScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    // TODO: Implement image picker when expo-image-picker is installed
    // Uncomment the following code after installing: npx expo install expo-image-picker

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }

  };

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter your first and last name');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/home-screen');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>Enter your correct details below</Text>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <Pressable
            onPress={handlePickImage}
            style={styles.photoContainer}
            accessibilityLabel="Add a photo"
            accessibilityRole="button"
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="person-outline" size={32} color="#000000" />
              </View>
            )}
          </Pressable>
          <Text style={styles.addPhotoText}>Add a photo</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Input
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            editable={!isLoading}
            disabled={isLoading}
          />

          <Input
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            editable={!isLoading}
            disabled={isLoading}
          />
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            onPress={handleContinue}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            Continue
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'DMSans-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  addPhotoText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DMSans-Medium',
    color: '#009321',
  },
  inputSection: {
    gap: 16,
    marginBottom: 40,
  },
  buttonSection: {
    // marginTop: 'auto',
    marginBottom: 34,
  },
});

