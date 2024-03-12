import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  PermissionsAndroid,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import ColorfulCard from '@freakycoder/react-native-colorful-card';
import Mapbox from '@rnmapbox/maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import BackButton from '../components/BackButton';
import {StoreData, storesData} from '../data/stores';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

Mapbox.setAccessToken(
  'sk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2x0aTlocTZjMDdvazJscDZlcThodGFnNSJ9.XY0LCJpWLUo8kja7zyFPUQ',
);
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const {TraccarModule} = NativeModules;

const MapScreen = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);
  const [coords, setCoords] = useState<[number, number]>([106.8516, 10.79744]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([
    12.48839, 90.72724,
  ]);
  const [selectedRouteProfile, setselectedRouteProfile] =
    useState<string>('walking');
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  function getRandomStore(): StoreData {
    const randomIndex = Math.floor(Math.random() * storesData.length);
    return storesData[randomIndex];
  }

  const store = getRandomStore();

  const routeProfiles = [
    {id: 'walking', label: 'Walking', icon: 'walking'},
    {id: 'cycling', label: 'Cylcing', icon: 'bicycle'},
    {id: 'driving', label: 'Driving', icon: 'car'},
  ];

  function makeRouterFeature(coordinates: [number, number][]): any {
    let routerFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  }

  async function createRouterLine(
    coords: [number, number],
    routeProfile: string,
  ): Promise<void> {
    const startCoords = `${coords[0]},${coords[1]}`;
    const endCoords = `${[store.longitude, store.latitude]}`;
    console.log('coords: ' + startCoords + 'end: ' + endCoords);
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg`;
    console.log('URL: ' + url);
    try {
      let response = await fetch(url);
      let json = await response.json();

      const data = json.routes.map((data: any) => {
        console.log(data);
        setDistance(data.distance);
        setDuration(data.duration);
      });

      let coordinates = json['routes'][0]['geometry']['coordinates'];
      let destinationCoordinates =
        json['routes'][0]['geometry']['coordinates'].slice(-1)[0];
      setDestinationCoords(destinationCoordinates);
      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirections(routerFeature);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleUserLocationUpdate = async (location: any) => {
    const {latitude, longitude, heading} = location.coords;
    console.log("User Location: " + latitude + " " + longitude);
    setCoords([longitude, latitude]);
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location ' +
              'so we can show your current location on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  const startTrackService = async () => {
    TraccarModule.setupTrackingService(
      'http://demo.traccar.org:5055',
      '156789',
      1,
    );
    TraccarModule.startTrackingService();
  };

  const onPress = async () => {
    try {
      await createRouterLine(coords, selectedRouteProfile);
      console.log('Create ROuter Line: ' + createRouterLine);
      startTrackService();
    } catch (error) {
      console.error('Error: ' + error);
    }
  };

  const onPressStop = async () => {
    try {
      TraccarModule.stopTrackingService();
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {id: string; label: string; icon: string};
  }) => (
    <TouchableOpacity
      style={[
        styles.routeProfileButton,
        item.id == selectedRouteProfile && styles.selectedRouteProfileButton,
      ]}
      onPress={() => setselectedRouteProfile(item.id)}>
      <Icon
        name={item.icon}
        size={24}
        color={
          item.id == selectedRouteProfile ? 'white' : 'rgba(255,255,255,0.6)'
        }
      />
      <Text
        style={[
          styles.routeProfileButtonText,
          item.id == selectedRouteProfile &&
            styles.selectedRouteProfileButtonText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          zoomEnabled={true}
          styleURL="mapbox://styles/mapbox/navigation-night-v1"
          rotateEnabled={true}>
          <Mapbox.Camera
            zoomLevel={5}
            centerCoordinate={[106.48839, 12.72724]}
            animationMode={'flyTo'}
            animationDuration={6000}
          />
          {routeDirections && (
            <Mapbox.ShapeSource id="line1" shape={routeDirections}>
              <Mapbox.LineLayer
                id="routerLine01"
                style={{
                  lineColor: '#FA9E14',
                  lineWidth: 4,
                }}
              />
            </Mapbox.ShapeSource>
          )}
          {destinationCoords && (
            <Mapbox.PointAnnotation
              id="destinationPoint"
              coordinate={destinationCoords}>
              <View style={styles.destinationIcon}>
                <Ionicons name="storefront" size={24} color="#E1710A" />
              </View>
            </Mapbox.PointAnnotation>
          )}
          <Mapbox.UserLocation
            minDisplacement={50}
            visible={true}
            showsUserHeadingIndicator={true}
            animated={true}
            androidRenderMode="gps"
            onUpdate={handleUserLocationUpdate}
            requestsAlwaysUse={true}></Mapbox.UserLocation>
        </Mapbox.MapView>
      </View>
      <BackButton />
      <Pressable onPress={onPress} style={styles.startButton}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
      <Pressable onPress={onPressStop} style={styles.stopButton}>
        <Text style={styles.buttonText}>Stop</Text>
      </Pressable>
      <FlatList
        data={routeProfiles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        contentContainerStyle={styles.routeProfileList}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
      {routeDirections && (
        <View style={styles.cardContainer}>
          <ColorfulCard
            title={`${store.name}`}
            value={`${duration} h`}
            footerTitle="Distance"
            footerValue={`${distance} km`}
            style={{backgroundColor: '#33495F'}}
            onPress={() => {}}
          />
        </View>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: windowHeight,
    width: windowWidth,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  buttons: {
    position: 'absolute', // Align buttons to the right
    width: 80,
    height: 50,
    bottom: 50,
    left: 5,
    borderRadius: 8,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },
  cardContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  routeProfileList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  flatList: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 40,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  routeProfileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 8,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  selectedRouteProfileButton: {
    backgroundColor: '#FA9E14',
    borderColor: '#FA9E14',
  },
  routeProfileButtonText: {
    color: '#fff',
    marginTop: 5,
  },
  selectedRouteProfileButtonText: {
    color: 'white',
  },
  destinationIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    left: 5,
  },
  stopButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
