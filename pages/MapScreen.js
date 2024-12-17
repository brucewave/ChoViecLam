import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import db from '../config/firebaseFirestore';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState({});
  const [lastTap, setLastTap] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    fetchCategories();
    fetchJobs();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const fetchCategories = async () => {
    try {
      const categoryRef = collection(db, 'Category');
      const querySnapshot = await getDocs(categoryRef);
      const categoryData = {};
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        categoryData[data.name] = data.imageUrl;
      });
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const jobsRef = collection(db, 'Jobs');
      const querySnapshot = await getDocs(jobsRef);
      const jobsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  const goToMyLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    mapRef?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const initialRegion = {
    latitude: location?.coords?.latitude || 16.0621562,
    longitude: location?.coords?.longitude || 108.2138805,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMarkerPress = (job) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap
      navigation.navigate('JobDetail', job);
    }
    setLastTap(now);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <MapView
        ref={(ref) => setMapRef(ref)}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {jobs.map((job) => (
          job.latitude && job.longitude ? (
            <Marker
              key={job.id}
              coordinate={{
                latitude: parseFloat(job.latitude),
                longitude: parseFloat(job.longitude)
              }}
              onPress={() => handleMarkerPress(job)}
              image={{ uri: categories[job.category] }}
              style={styles.marker}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{job.title}</Text>
                  <Text style={styles.calloutSalary}>{job.salary}k/h</Text>
                  <Text style={styles.calloutAddress} numberOfLines={2}>
                    {job.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ) : null
        ))}
      </MapView>

      <TouchableOpacity 
        style={styles.myLocationButton}
        onPress={goToMyLocation}
      >
        <Text style={styles.myLocationButtonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myLocationButtonText: {
    fontSize: 20,
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutSalary: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
  },
  marker: {
    width: 35,
    height: 35,
  }
});

export default MapScreen;