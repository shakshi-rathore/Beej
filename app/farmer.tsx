import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView, StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../utils/firebase';

// const API_URL = 'http://192.168.57.191:5000/api/farmers';
const API_URL = 'http://10.173.21.191:5000/api/farmers';


const districts = ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Noida', 'Prayagraj', 'Ayodhya', 'Mathura', 'Bareilly', 'Aligarh'];
const languages = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu', 'Marathi'];

type FarmerProfileForm = {
  name: string;
  location: string;
  language: string;
  landSize: string;
  cropType: string;
  irrigation: string;
  profilePic?: string;
};

export default function FarmerProfile() {
  const [form, setForm] = useState<FarmerProfileForm>({
    name: '',
    location: '',
    language: '',
    landSize: '',
    cropType: '',
    irrigation: '',
    profilePic: '',
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const res = await fetch(`${API_URL}/${user.uid}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        setForm(data);
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Error', 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (key: keyof FarmerProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateProfile = async () => {
    if (!form.name || !form.location || !form.language || !form.landSize) {
      return Alert.alert('Incomplete', 'Please fill in all required fields.');
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const formData = new FormData();
      formData.append('uid', user.uid);
      formData.append('name', form.name);
      formData.append('location', form.location);
      formData.append('language', form.language);
      formData.append('landSize', form.landSize);
      formData.append('cropType', form.cropType);
      formData.append('irrigation', form.irrigation);

      //  append image if new 
      if (form.profilePic && form.profilePic.startsWith('file')) {
        const fileType = form.profilePic.split('.').pop();
        formData.append('profilePic', {
          uri: form.profilePic,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedData = await res.json();
      setForm(updatedData);
      Alert.alert('Success', 'Profile updated!');
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return Alert.alert('Permission denied', 'Camera roll access is required.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setForm(prev => ({ ...prev, profilePic: imageUri }));
        Alert.alert('Image Selected', 'Tap "Save Changes" to upload.');
      }
    } catch (err) {
      console.error('Image error:', err);
      Alert.alert('Error', 'Image selection failed.');
    }
  };

 const removeImage = async () => {
  const user = auth.currentUser;
  if (!user || !form.profilePic) return;

  try {
    const res = await fetch(`${API_URL}/remove-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid }),
    });

    if (!res.ok) throw new Error('Failed to delete image');

    setForm(prev => ({ ...prev, profilePic: '' }));
    Alert.alert('Removed', 'Profile photo deleted');
  } catch (err) {
    console.error('Remove error:', err);
    Alert.alert('Error', 'Could not remove photo');
  }
};


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.heading}>My Profile</Text>

    <View style={styles.imageContainer}>
      {form.profilePic ? (
        <>
          <Image
            source={{
              uri: form.profilePic.startsWith('/uploads/')
                // ? `http://192.168.57.191:5000${form.profilePic}`
                 ? `http://10.173.21.191:5000${form.profilePic}`
                : form.profilePic,
            }}
            style={styles.image}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          <TouchableOpacity onPress={removeImage} style={[styles.uploadButton, { backgroundColor: '#d32f2f' }]}>
            <Text style={styles.uploadText}>Remove Photo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ color: '#999' }}>No Image</Text>
        </View>
      )}
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload Photo'}</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.label}>Name</Text>
    <TextInput placeholder="Enter name" style={styles.input} value={form.name} onChangeText={val => handleChange('name', val)} />

    <Text style={styles.label}>Location (District)</Text>
    <Picker selectedValue={form.location} onValueChange={val => handleChange('location', val)} style={styles.picker}>
      <Picker.Item label="Select District" value="" />
      {districts.map(d => <Picker.Item key={d} label={d} value={d} />)}
    </Picker>

    <Text style={styles.label}>Preferred Language</Text>
    <Picker selectedValue={form.language} onValueChange={val => handleChange('language', val)} style={styles.picker}>
      <Picker.Item label="Select Language" value="" />
      {languages.map(lang => <Picker.Item key={lang} label={lang} value={lang} />)}
    </Picker>

    <Text style={styles.label}>Land Size (in acres)</Text>
    <TextInput placeholder="e.g., 5" style={styles.input} value={form.landSize} onChangeText={val => handleChange('landSize', val)} keyboardType="numeric" />

    <Text style={styles.label}>Crop Type</Text>
    <TextInput placeholder="e.g., Wheat, Rice" style={styles.input} value={form.cropType} onChangeText={val => handleChange('cropType', val)} />

    <Text style={styles.label}>Irrigation Method</Text>
    <TextInput placeholder="e.g., Drip, Canal" style={styles.input} value={form.irrigation} onChangeText={val => handleChange('irrigation', val)} />

    <Button title="Save Changes" onPress={updateProfile} />
  </ScrollView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
