import { useRouter } from 'expo-router';
import { ArrowLeft, Landmark } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MadadScreen() {
  const [schemes, setSchemes] = useState([]);
  const router = useRouter();

  useEffect(() => {
  // fetch('http://10.169.76.205:5000/schemes')
  fetch('http://10.0.2.2:5000/schemes')
    .then(async res => {
      const text = await res.text();
      // console.log('Raw response:', text);
      try {
        const data = JSON.parse(text);
        // console.log('Parsed JSON:', data);
        setSchemes(data);
      } catch (err) {
        console.error('JSON parse error:', err.message);
        Alert.alert('Parsing Error', err.message);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err.message);
      Alert.alert('Fetch Error', err.message);
    });
}, []);


  // const handleLearnMore = (id: string) => {
  //   router.push(`/madadDetail?id=${id}`);
  // };
const handleLearnMore = (docPath: string) => {
  const fullUrl = `http://10.0.2.2:5000/${docPath}`;
  // const fullUrl = `http://10.173.21.191:5000/${docPath}`;
  Linking.openURL(fullUrl);
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sarkari Madad</Text>
        <Landmark size={24} color="white" />
      </View>

      {/* Cards */}
      {schemes.length > 0 ? (
  schemes.map((scheme: any) => (
    <View key={String(scheme._id)} style={styles.card}>
      <Text style={styles.cardTitle}>{scheme.title}</Text>
      <Text style={styles.cardText}>{scheme.description || 'Blank for now'}</Text>
      <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.buttons} onPress={() => handleLearnMore(scheme.document)}>
    <Text style={styles.buttonText}>Learn more..</Text>
  </TouchableOpacity>
</View>

    </View>
  ))
) : (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading or no schemes available</Text>
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: ' #D3D3D3',
    padding: 26,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 6.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 8,
    padding:8
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 8,
},

buttons: {
  backgroundColor: '#2196f3',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
  alignSelf: 'flex-end',
},

});
