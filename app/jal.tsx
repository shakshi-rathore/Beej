import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function JalSahayak() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Jal Sahayak</Text>
      </View>

      {/* Red Error Card */}
      <View style={styles.errorCard}>
        <Text style={styles.errorTitle}>OOPS!!!!</Text>
        <Text style={styles.errorMessage}>Sorry for inconvenience, our team is working on it.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'green',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorCard: {
    backgroundColor: '#ffcccc',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: 'red',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
