import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack' 
import Home from '../screens/Home';
import CameraScreen from '../screens/CameraScreen';
import QrScan from '../screens/QrScan';
import CropImage from '../screens/CropImage';
import type { Routes } from '../Routes/Routes';
import Map from '../screens/Map';
import CodeDetector from '../screens/CodeDetector';

const Tabs = createNativeStackNavigator<Routes>();

const RootNavigation = () => {
  return (
    <Tabs.Navigator initialRouteName='Home'>
      <Tabs.Screen name='Home' component={Home}/>
      <Tabs.Screen name='CameraScreen' component={CameraScreen} options={{headerShown: false}}/>
      <Tabs.Screen name='QrScan' component={QrScan} options={{headerShown: false}}/>
      <Tabs.Screen name='CropImage' component={CropImage} options={{headerShown: false}}/>
      <Tabs.Screen name='Map' component={Map} options={{headerShown: false}}/>
      <Tabs.Screen name='CodeDetector' component={CodeDetector} options={{headerShown: false}}/>
    </Tabs.Navigator>
  )
}

export default RootNavigation
