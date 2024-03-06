import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack' 
import Home from '../screens/Home';
import CameraScreen from '../screens/CameraScreen';
import QrScan from '../screens/QrScan';
import type { Routes } from '../Routes/Routes';

const Tabs = createNativeStackNavigator<Routes>();

const RootNavigation = () => {
  return (
    <Tabs.Navigator initialRouteName='Home'>
      <Tabs.Screen name='Home' component={Home}/>
      <Tabs.Screen name='CameraScreen' component={CameraScreen}/>
      <Tabs.Screen name='QrScan' component={QrScan}/>
    </Tabs.Navigator>
  )
}

export default RootNavigation
