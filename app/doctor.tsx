import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { diseasesByCrop } from '../data/diseases';
import { questionsByCrop } from '../data/questions';
import type { CropType, Disease, Question } from '../data/types';



const DoctorScreen: React.FC = () => {
  const navigation = useNavigation();
 useEffect(() => {
  const fetchCropType = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return alert('User UID not found');

      // const res = await fetch(`http://192.168.57.191:5000/api/farmers/${uid}`);
      const res = await fetch(`http://10.173.21.191:5000/api/farmers/${uid}`);
      const data = await res.json();

      if (data.cropType) {
        setCropType(data.cropType.trim().toLowerCase());
      }
    } catch (err) {
      console.error('Error fetching cropType:', err);
      alert('Failed to load crop type');
    } finally {
      setLoading(false);
    }
  };

  fetchCropType();
}, []);

  // Dropdown state
  const [cropType, setCropType] = useState<CropType | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [items, setItems] = useState([
  { label: 'Potato', value: 'potato' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Rice', value: 'rice' },
  { label: 'Maize', value: 'maize' },
  { label: 'Watermelon', value: 'watermelon' },
  { label: 'Muskmelon', value: 'muskmelon' },
]);

const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [diagnosis, setDiagnosis] = useState<Disease | null>(null);

  // Reset answers & diagnosis on crop change
  useEffect(() => {
    setAnswers({});
    setDiagnosis(null);
  }, [cropType]);

  // Get questions for selected crop
  const questions: Question[] = cropType ? questionsByCrop[cropType] : [];

  // Get diseases for selected crop
  const diseases: Disease[] = cropType ? diseasesByCrop[cropType] : [];

  // Record answer
  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Diagnosis logic
  const diagnose = () => {
    if (!diseases.length) {
      setDiagnosis(null);
      return;
    }

    let bestMatch: Disease | null = null;
    let maxMatches = 0;

    diseases.forEach((disease) => {
      const matchCount = disease.symptoms.filter(
        (symptom) => answers[symptom] === true
      ).length;

      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = disease;
      }
    });

    if (maxMatches > 0 && bestMatch) {
      setDiagnosis(bestMatch);
    } else {
      setDiagnosis(null);
      alert('No matching disease found. Please answer symptoms carefully.');
    }
  };
  useEffect(() => {
  if (!diagnosis) return;

  const matchedSymptoms = diagnosis.symptoms.filter(
    (symptom) => answers[symptom] === true
  );

  if (matchedSymptoms.length === 0) {
    setDiagnosis(null);
  }
}, [answers]);


  // Dropdown items for all crops
  const cropItems = [
    { label: 'Rice', value: 'rice' },
    { label: 'Wheat', value: 'wheat' },
    { label: 'Maize', value: 'maize' },
    { label: 'Potato', value: 'potato' },
    { label: 'Muskmelon', value: 'muskmelon' },
    { label: 'Watermelon', value: 'watermelon' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beej Doctor</Text>
      </View>

      {/* Crop dropdown */}
      <View style={{ zIndex: 3000, elevation: 5, marginBottom: 16 }}>
        {!loading && (
  <View style={{ zIndex: 3000, elevation: 5, marginBottom: 16 }}>
    <DropDownPicker
      open={dropdownOpen}
      value={items.some(item => item.value === cropType) ? cropType : null}
      items={items}
      setOpen={setDropdownOpen}
      setValue={(val) => setCropType(val)}
      setItems={setItems}
      style={styles.dropdown}
      placeholder={
        cropType
          ? cropType.charAt(0).toUpperCase() + cropType.slice(1)
          : 'Select crop'
      }
      dropDownContainerStyle={styles.dropDownContainer}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
    />
  </View>
)}

      </View>

      {/* Questions */}
      {cropType ? (
        <>
          {questions.length > 0 ? (
  questions.map((q) => (
    <View key={q.id} style={styles.questionContainer}>
      <Text style={styles.questionText}>{q.question}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            answers[q.id] === true && styles.selectedOption,
          ]}
          onPress={() => handleAnswer(q.id, true)}
        >
          <Text style={answers[q.id] === true ? styles.optionTextSelected : styles.optionText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            answers[q.id] === false && styles.selectedOption,
          ]}
          onPress={() => handleAnswer(q.id, false)}
        >
          <Text style={answers[q.id] === false ? styles.optionTextSelected : styles.optionText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Show image for each question */}
      {q.image ? (
        <Image
          source={q.image}
          style={styles.diagnosisImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imageBox}>
          <Text style={styles.imageBoxText}>No image available</Text>
        </View>
      )}
    </View>
  ))
) : (
  <Text style={{ fontStyle: 'italic' }}>No questions available for this crop.</Text>
)}


          {/* Diagnose button */}
          <TouchableOpacity style={styles.diagnoseButton} onPress={diagnose}>
            <Text style={styles.diagnoseButtonText}>Diagnose</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
          Please select a crop to begin diagnosis.
        </Text>
      )}

      {/* Diagnosis result */}
    
{diagnosis && (
  <View style={styles.diagnosisCard}>
    <Text style={styles.diagnosisTitle}>{diagnosis.name}</Text>

    {/* Matched symptoms */}
    <Text style={styles.sectionTitle}>Matched Symptoms:</Text>
    {diagnosis.symptoms?.length > 0 ? (
      diagnosis.symptoms
        .filter((symptomId) => answers[symptomId])
        .map((symptomId) => {
          const question = questions.find((q) => q.id === symptomId);
          return (
            <Text key={symptomId} style={styles.symptomText}>
              • {question?.question || 'Unknown symptom'}
            </Text>
          );
        })
    ) : (
      <Text style={styles.symptomText}>No matched symptoms.</Text>
    )}

    {/* Causes */}
    <Text style={styles.diagnosisLabel}>Causes:</Text>
    <Text style={styles.diagnosisText}>
      {diagnosis.cause || 'Cause information not available.'}
    </Text>

    {/* Treatment */}
    <Text style={styles.diagnosisLabel}>Treatment:</Text>
    <Text style={styles.diagnosisText}>
      {diagnosis.treatment || 'Treatment information not available.'}
    </Text>

    {/* Prevention */}
    <Text style={styles.diagnosisLabel}>Prevention:</Text>
    <Text style={styles.diagnosisText}>
      {diagnosis.prevention || 'Prevention information not available.'}
    </Text>

    {/* Image */}
    <Text style={styles.diagnosisLabel}>Image:</Text>
    {diagnosis.image ? (
      typeof diagnosis.image === 'number' ? (
        <Image
          source={diagnosis.image}
          style={styles.diagnosisImage}
          resizeMode="contain"
        />
      ) : typeof diagnosis.image === 'string' && diagnosis.image.trim() !== '' ? (
        <Image
          source={{ uri: diagnosis.image }}
          style={styles.diagnosisImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imageBox}>
          <Text style={styles.imageBoxText}>No image available</Text>
        </View>
      )
    ) : (
      <View style={styles.imageBox}>
        <Text style={styles.imageBoxText}>No image available</Text>
      </View>
    )}
  </View>
)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  dropdown: {
  borderColor: '#388e3c',
  marginBottom: 20,
  zIndex: 3000,
},
dropDownContainer: {
  borderColor: '#388e3c',
  maxHeight: 350,
  zIndex: 2000,
  elevation: 5,
},

  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#d0e9ff',
    borderColor: '#2196f3',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  diagnoseButton: {
    marginTop: 30,
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  diagnoseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  diagnosisCard: {
    marginTop: 30,
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  diagnosisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0d47a1',
  },
  diagnosisLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  diagnosisText: {
    fontSize: 15,
    marginTop: 4,
    lineHeight: 20,
    color: '#333',
  },
  diagnosisImage: {
    marginTop: 20,
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
  imageBox: {
  marginTop: 12,
  height: 150,
  backgroundColor: '#eee',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
},
imageBoxText: {
  color: '#888',
  fontStyle: 'italic',
},

});

export default DoctorScreen;
