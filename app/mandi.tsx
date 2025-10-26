import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Info,
  ShoppingCart,
  XCircle,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MandiScreen() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [farmerUid, setFarmerUid] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const fetchUidAndContracts = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (uid) {
          setFarmerUid(uid);
          
          // const res = await axios.get(`http://10.169.76.205:5000/api/contracts/${uid}`);
          const res = await axios.get(`http://10.0.2.2:5000/api/contracts/${uid}`);
          setContracts(res.data);
        } else {
          console.warn('No UID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUidAndContracts();
  }, []);

  const showDetails = (item) => {
    setSelectedContract(item);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideDetails = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedContract(null));
  };

  const renderContractItem = ({ item }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <ShoppingCart size={20} color="#007bff" />
        <Text style={styles.contractTitle}>{item.title}</Text>
      </View>
      <Text style={styles.contractText}>Type: {item.type}</Text>
      <Text style={styles.contractText}>Status: {item.status}</Text>
      <TouchableOpacity style={styles.moreButton} onPress={() => showDetails(item)}>
        <Text style={styles.moreButtonText}>Tap to know more</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Contracts</Text>
        <FileText color="white" size={24} />
      </View>

      {/* Contract Details Panel */}
      {selectedContract && (
        <Animated.View style={[styles.detailContainer, { opacity: fadeAnim }]}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailHeaderText}>📄 Contract Details</Text>
            <TouchableOpacity onPress={hideDetails}>
              <XCircle size={24} color="#d00" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <FileText size={20} color="#333" />
            <Text style={styles.detailText}>Type: {selectedContract.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Info size={20} color="#333" />
            <Text style={styles.detailText}>Production: {selectedContract.productionPromised}</Text>
          </View>

          <View style={styles.detailRow}>
            <CheckCircle size={20} color="green" />
            <Text style={styles.detailText}>Assured Return: ₹{selectedContract.assuredReturn}</Text>
          </View>

          <View style={styles.detailRow}>
            <FileText size={20} color="#007BFF" />
            <Text style={styles.detailText}>Total Sales: ₹{selectedContract.totalSales}</Text>
          </View>

          <View style={styles.detailRow}>
            {selectedContract.status?.toLowerCase() === 'active' ? (
              <CheckCircle size={20} color="green" />
            ) : (
              <XCircle size={20} color="red" />
            )}
            <Text style={styles.detailText}>Status: {selectedContract.status}</Text>
          </View>

          <View style={styles.detailRow}>
            <FileText size={20} color="#555" />
            <Text style={styles.detailText}>
              Start: {new Date(selectedContract.startDate).toDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FileText size={20} color="#555" />
            <Text style={styles.detailText}>
              End: {new Date(selectedContract.endDate).toDateString()}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Contracts List */}
      <View style={{ padding: 16, flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : contracts.length === 0 ? (
          <Text>No contracts found for this farmer.</Text>
        ) : (
          <FlatList
            data={contracts}
            keyExtractor={(item) => item._id}
            renderItem={renderContractItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contractCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#007bff',
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  contractText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  moreButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  moreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailContainer: {
    backgroundColor: '#eaffea',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
    marginTop: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
});
