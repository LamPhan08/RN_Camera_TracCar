import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import { useBarcodeScanner, CameraHighlights } from '@mgcrea/vision-camera-barcode-scanner'

const CodeDetector = () => {
  const device: any = useCameraDevice('back')

  const { props, highlights } = useBarcodeScanner({
    barcodeTypes: ['qr', 'code-128'],
    
    onBarcodeScanned(barcodes, frame) {
      'worklet'
    },
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Camera
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        {...props}
      />

      <CameraHighlights highlights={highlights} color='red' />

    </SafeAreaView>
  )
}

export default CodeDetector
