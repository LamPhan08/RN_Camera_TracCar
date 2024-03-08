import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';

import BackButton from '../components/BackButton';

Mapbox.setAccessToken('sk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2x0aTlocTZjMDdvazJscDZlcThodGFnNSJ9.XY0LCJpWLUo8kja7zyFPUQ');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MapScreen = () => {

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>

        </Mapbox.MapView>
      </View>
      <BackButton /> 
    </View>
  );
}

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
    flex: 1
  }
});
