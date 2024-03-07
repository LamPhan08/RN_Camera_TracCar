import React, { useRef } from 'react'
import { SafeAreaView, StyleSheet, Alert, AlertButton, Linking } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'

const QrScan = () => {
    const device: any = useCameraDevice('back')

    const isShowingAlert = useRef(false)

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned(codes, frame) {
            const value = codes[0].value

            // console.info("codes:", codes)
            // console.info("codes[0]:", codes[0])
            // console.info("codes[1]:", codes[1])

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

                if (value?.startsWith('http')) {
                  buttons.push({
                    text: 'Open Url',
                    onPress: () => {
                      Linking.openURL(value)

                      isShowingAlert.current = false
                    }
                  })
                }

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
