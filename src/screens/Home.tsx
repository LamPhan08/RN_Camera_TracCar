import React, { useState } from 'react'
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera'
import { View, SafeAreaView, TouchableOpacity, Text, Linking } from 'react-native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import type {Routes} from '../Routes/Routes'

type Props = NativeStackScreenProps<Routes, 'Home'>

const Home = ({navigation}: Props): React.ReactElement => {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('not-determined')
    const [microPermission, setMicroPermission] = useState<CameraPermissionStatus>('not-determined')

    const handleOpenCamera = async () => {
        const _cameraPermission = await Camera.requestCameraPermission()
        const _microPermission = await Camera.requestMicrophonePermission()

        if (_cameraPermission === 'granted' && _microPermission === 'granted') {
            navigation.navigate('CameraScreen')
        }
        else if (cameraPermission === 'denied' || microPermission === 'denied') {
            await Linking.openSettings()
        }

        setCameraPermission(_cameraPermission)
        setMicroPermission(_microPermission)

        // console.log(cameraPermission)
    }

    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 20 }}>Camera</Text>

            <TouchableOpacity style={{ padding: 10 }} onPress={() => handleOpenCamera()}>
                <Text>Open Camera</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Home
