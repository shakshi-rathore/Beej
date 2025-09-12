import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../utils/firebase';

const districts = ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Noida', 'Prayagraj', 'Ayodhya', 'Mathura', 'Bareilly', 'Aligarh'];
const languages = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu', 'Marathi'];

const fields = ['name', 'location', 'language', 'landSize', 'cropType', 'irrigation'] as const;
type FieldKey = typeof fields[number];

export default function ProfileSetupScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    location: districts[0],
    language: languages[0],
    landSize: '',
    cropType: '',
    irrigation: '',
  });

  const router = useRouter();

  const handleChange = (key: FieldKey, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < fields.length - 1) {
      setStep(step + 1);
    } else {
      saveProfile();
    }
  };

 const saveProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Error', 'User not logged in');

    const response = await fetch('http://192.168.57.191:5000/api/farmers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, ...form }),
    });

    if (!response.ok) throw new Error('Server error');

    Alert.alert('Success', 'Profile saved!');
    router.replace('/farmer');
  } catch (err) {
    Alert.alert('Error', 'Failed to save profile');
    console.error(err);
  }
};

  const renderField = () => {
    const key = fields[step];
    const label = {
      name: 'Your Name',
      location: 'Select District',
      language: 'Preferred Language',
      landSize: 'Land Size (acres)',
      cropType: 'Crop Type',
      irrigation: 'Irrigation Method',
    }[key];

    if (key === 'location') {
      return (
        <>
          <Text style={styles.label}>{label}</Text>
          <Picker selectedValue={form.location} onValueChange={val => handleChange('location', val)} style={styles.picker}>
            {districts.map(d => <Picker.Item key={d} label={d} value={d} />)}
          </Picker>
        </>
      );
    }

    if (key === 'language') {
      return (
        <>
          <Text style={styles.label}>{label}</Text>
          <Picker selectedValue={form.language} onValueChange={val => handleChange('language', val)} style={styles.picker}>
            {languages.map(lang => <Picker.Item key={lang} label={lang} value={lang} />)}
          </Picker>
        </>
      );
    }

    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={form[key]}
          onChangeText={val => handleChange(key, val)}
          keyboardType={key === 'landSize' ? 'numeric' : 'default'}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Details</Text>
      {renderField()}
      <Button title={step < fields.length - 1 ? 'Next' : 'Finish'} onPress={nextStep} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginBottom: 5, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 },
  picker: { marginBottom: 20, backgroundColor: '#fff' },
});
