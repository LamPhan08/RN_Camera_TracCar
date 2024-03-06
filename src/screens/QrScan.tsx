import React, { useRef } from 'react'
import { SafeAreaView, StyleSheet, Alert, AlertButton } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner,  } from 'react-native-vision-camera'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import { Routes } from '../Routes/Routes'

type Props = NativeStackScreenProps<Routes, 'QrScan'>

const QrScan = ({navigation}: Props) => {
    const device: any = useCameraDevice('back')

    const isShowingAlert = useRef(false)

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned(codes, frame) {
            const value = codes[0].value

            if (value === null) {
                return
            }

            if (isShowingAlert.current) {
                return
            }
            else {
                const buttons: AlertButton[] = [{
                    text: 'Ok',
                    style: 'cancel',
                    onPress: () => {
                        isShowingAlert.current = false
                    }
                }]

                Alert.alert('Scanned code', value, buttons)
            }

            isShowingAlert.current = true
        },
    })

  return (
    <SafeAreaView style={{flex: 1}}>
      <Camera
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
      />
    </SafeAreaView>
  )
}

export default QrScan
