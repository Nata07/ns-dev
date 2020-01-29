import React,{useState , useEffect } from 'react'
import MapView, {Marker, Callout} from 'react-native-maps'
import {StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from 'react-native'
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons} from '@expo/vector-icons'
import api from '../services/api'
import socket from '../services/socket'
import {connect, disconnect} from '../services/socket'

function Main({navigation}) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');

  useEffect(() => {
      async function loadInitialLocation() {
        const {granted} = await requestPermissionsAsync();
        
        if(granted) {
          const {coords} = await getCurrentPositionAsync({
            enableHighAccuracy: false,
          });
        
          const {latitude, longitude} = coords;
          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        }
      }
    loadInitialLocation();
  }, []);

  function setupWebsocket() {
    connect();
  }

  async function loadDevs(){
    const {latitude, longitude}=currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    });

    setDevs(response.data.devs);
    setupWebsocket() 
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }
  if(!currentRegion){
    return null;
  }
    
  return (
    <>
    <MapView 
      onRegionChangeComplete={handleRegionChanged} 
      initialRegion={currentRegion} style={styles.map}>
        {devs.map(dev => (
          <Marker 
              key={dev._id }
              coordinate={{
                longitude: dev.location.coordinates[0],  
                latitude: dev.location.coordinates[1], 
              }}>
            <Image 
              style={styles.avatar} 
              source={{uri: dev.avatar_url}}/>
            <Callout onPress={() => {
               navigation.navigate('Profile', {github_username: dev.github_username});
             }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
    </MapView>
    <View style={styles.searchForm}>
    <TextInput
        style={styles.searchInput}
        placeholder="
        Search devs for techs..."
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
        value={techs}
        onChangeText={setTechs}>
      </TextInput>
      <TouchableOpacity onPress={() => {loadDevs()}} style={styles.loadButton}> 
          <MaterialIcons name="my-location" size={20} color="#fff"></MaterialIcons>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff', 
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  devTechs: {
    marginTop: 5
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },
  searchInput: {
    flex:1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius:25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8e4dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }

})
export default Main;