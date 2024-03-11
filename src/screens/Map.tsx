import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  PermissionsAndroid,
  Button,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../components/BackButton';

Mapbox.setAccessToken(
  'sk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2x0aTlocTZjMDdvazJscDZlcThodGFnNSJ9.XY0LCJpWLUo8kja7zyFPUQ',
);
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const {TraccarModule} = NativeModules;

const MapScreen = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

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
  
  const startTrackService = async() => {
    TraccarModule.setupTrackingService(
      'http://demo.traccar.org:5055',
      '8790234',
      1,
    );
    TraccarModule.startTrackingService();
    console.log('Hello' + '879024');
  }; 

  const onPress = async () => {
    try {
      startTrackService();
    } catch (error) {
      console.log('Error: ' + error);
    }
  };

  const onPressStop = async () => {
    TraccarModule.stopTrackingService();
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}></Mapbox.MapView>
      </View>
      <BackButton />
      <View style={{position:'absolute'}}>
        <Button
          title="Click to invoke your native module!"
          color="#841584"
          onPress={onPress}
        />
        <Button
          title="Click to invoke your native module!"
          color="#841584"
          onPress={onPressStop}
        />
      </View>
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
    flex: 1,
  },
});
