import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Link, Redirect, useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Bell, Droplet, Landmark, LogOut, Stethoscope, Store, Sun, UserCircle, Wind } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../utils/firebase';
import { fetchWeather } from './weather';


export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [weather, setWeather] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
  let isMounted = true;

  (async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const weatherData = await fetchWeather(location.coords.latitude, location.coords.longitude);
      if (isMounted) setWeather(weatherData);
    } catch (err) {
      Alert.alert("Weather Error", err.message);
    }
  })();

  return () => {
    isMounted = false;
  };
}, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  const month = new Date().getMonth() + 1;

let seasonData;

if (month >= 6 && month <= 10) {
  seasonData = {
    title: "🌾 Kharif Season (June - October)",
    tips: [
      "Sowing starts with the monsoon (June-July)",
      "Promote intercropping",
    ],
    crops: [
      "Paddy (Rice) - Main Kharif crop in UP",
      "Maize (Corn) – Popular for fodder and grain",
      "Bajra (Pearl Millet) - Drought-prone areas (Bundelkhand)",
      "Urad, Moong (Pulses that enrich soil)",
      "Groundnut & Soybean - Oilseed options",
    ],
  };
} else if (month >= 10 || month <= 3) {
  seasonData = {
    title: "🌱 Rabi Season (October - March)",
    tips: [
      "Timely sowing (before mid-Nov) increases yield",
      "Use certified seeds",
    ],
    crops: [
      "Wheat - Most dominant Rabi crop in UP",
      "Mustard - Profitable oilseed crop",
      "Gram (Chana) - Improves soil fertility",
      "Barley - Water-scarce alternative",
      "Peas, Lentils - Popular pulses",
    ],
  };
} else {
  seasonData = {
    title: "☀️ Zaid Season (March - June)",
    tips: [
      "Use drip irrigation for water conservation",
      "Mulching helps retain soil moisture",
    ],
    crops: [
      "Watermelon, Muskmelon - Cash crops",
      "Cucumber, Bitter Gourd, Bottle Gourd",
      "Green Fodder - For livestock (sorghum, maize)",
    ],
  };
}

  return (
    <View style={styles.container}>
    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.jpg')} style={styles.logo} />
          <Text style={styles.beejText}>Beej</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => Alert.alert('Notifications')}>
            <Bell size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/farmer')}>
            <UserCircle size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <LogOut size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <LinearGradient colors={["#4CAF50","#4CAF50","#4CAF50","#4CAF50", "#556B2F", "#5D4037"]} style={styles.welcomeSection}>
  <View style={styles.welcomeContent}>
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Welcome to Beej</Text>
      
      <Text style={styles.description}>
        Har beej mein chhupi hai vikas ki aasha,
        poshan ho ya paani, Sarkari madad ho ya rog pehchan ka sahara,
      </Text>
      <Text style={styles.boldLine}>har pal tayyar, har mausam ke liye taiyaar</Text>
    </View>
    <Image
      source={require('../assets/farmer2.jpg')} 
      style={styles.farmerImage}
      resizeMode="contain"
    />
  </View>
</LinearGradient>

     {weather ? (
  <View style={styles.weatherCard}>
    <View style={styles.weatherTop}>
      <Text style={styles.weatherTemp}>
        {Math.round(weather.current.main.temp)}°C
      </Text>
      <Text style={styles.weatherDesc}>
        {weather.current.weather[0].main}
      </Text>
    </View>

    <View style={styles.weatherMiddle}>
      <View style={styles.weatherIconBlock}>
        <Sun size={32} color="#FFA500" />
        <Text style={styles.iconLabel}>Sunrise</Text>
      </View>
      <View style={styles.weatherIconBlock}>
        <Droplet size={32} color="#2196F3" />
        <Text style={styles.iconLabel}>Humidity</Text>
      </View>
      <View style={styles.weatherIconBlock}>
        <Wind size={32} color="#4CAF50" />
        <Text style={styles.iconLabel}>Wind</Text>
      </View>
    </View>

    <View style={styles.weatherBottom}>
      {weather.forecast.map((item, index) => (
        <View key={index} style={styles.weatherDay}>
          <Text style={styles.weatherDayText}>
            {new Date(item.dt * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <Text style={styles.weatherDayTemp}>
            {Math.round(item.main.temp)}°C
          </Text>
        </View>
      ))}
    </View>
  </View>
) : (
  <View style={styles.blankSection}>
    <Text style={styles.blankText}>Loading weather...</Text>
  </View>
)}
{/* Seasonal Advisory Section */}
<View style={styles.seasonCard}>
  <Text style={styles.seasonTitle}>Seasonal Advisory</Text>
  <View style={styles.cardBox}>
    <Text style={styles.seasonHeading}>{seasonData.title}</Text>

    {seasonData.tips && (
      <View style={styles.tipBox}>
        {seasonData.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    )}

    <Text style={styles.subHeading}>Recommended Crops:</Text>
    {seasonData.crops.map((crop, index) => (
      <Text key={index} style={styles.cropText}>- {crop}</Text>
    ))}
  </View>



</View>
</ScrollView>
      {/* Footer */}
      <View style={styles.footer}>
        <Link href="/jal" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Droplet size={20} color="white" />
            <Text style={styles.footerText}>Jal Sahayak</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/mandi" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Store size={20} color="white" />
            <Text style={styles.footerText}>My Contracts </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/madad" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Landmark size={20} color="white" />
            <Text style={styles.footerText}>Sarkari Madad</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/doctor" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Stethoscope size={20} color="white" />
            <Text style={styles.footerText}>Beej Doctor</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
  justifyContent: 'space-between',
  },
  content: {
  flex: 1,
},
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  beejText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  welcomeSection: {
    padding: 16,
  },
  title: {
    fontSize: 36, // Larger font size
    fontFamily: 'cursive',
    marginBottom: 10,
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: 'white',
    marginBottom: 10,
  },
  boldLine: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  blankSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blankText: {
    fontSize: 16,
    color: 'gray',
  },
  footer: {
    position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#4CAF50',
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  welcomeContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding:5,
  marginBottom:20
},
farmerImage: {
  width: 100,
  height: 100,
  marginLeft: 5,
  borderRadius:100
},
weatherCard: {
  backgroundColor: '#f5f5dc',
  margin: 16,
  padding: 16,
  borderRadius: 12,
  elevation: 4,
},
weatherTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
},
weatherTemp: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#5D4037',
},
weatherDesc: {
  fontSize: 20,
  color: '#5D4037',
},
weatherBottom: {
  flexDirection: 'row',
  justifyContent: 'space-around',
},
weatherDay: {
  alignItems: 'center',
},
weatherDayText: {
  fontSize: 16,
  color: '#5D4037',
},
weatherDayTemp: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#5D4037',
},
weatherMiddle: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 12,
},

weatherIconBlock: {
  alignItems: 'center',
},

iconLabel: {
  fontSize: 12,
  color: '#5D4037',
},
seasonCard: {
  backgroundColor: '#e0f2f1',
  marginHorizontal: 16,
  marginTop: 10,
  marginBottom: 16,
  padding: 16,
  borderRadius: 10,
},

seasonTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2e7d32',
  marginBottom: 10,
},

cardBox: {
  backgroundColor: '#ffffff',
  padding: 12,
  borderRadius: 10,
  elevation: 2,
},

seasonHeading: {
  fontSize: 16,
  fontWeight: '600',
  color: '#388e3c',
  marginBottom: 8,
},

tipBox: {
  marginBottom: 10,
},

tipItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

bullet: {
  fontSize: 16,
  marginRight: 4,
  color: '#4CAF50',
},

tipText: {
  flex: 1,
  fontSize: 14,
  color: '#444',
},

subHeading: {
  fontWeight: 'bold',
  fontSize: 15,
  marginTop: 8,
  marginBottom: 4,
  color: '#33691E',
},

cropText: {
  fontSize: 14,
  color: '#555',
},


});
