import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, Dimensions, View, Modal, PixelRatio, Pressable, Text, TouchableOpacity, Linking } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera'
import {
  CameraHighlights,
  useBarcodeScanner,

} from "@mgcrea/vision-camera-barcode-scanner";
import { Svg, Defs, Rect, Mask } from 'react-native-svg';
import { useSharedValue } from 'react-native-worklets-core';

const { width, height } = Dimensions.get('screen')
const screenWidth = height * PixelRatio.get();
const screenHeight = width * PixelRatio.get();

const QrScan = () => {
  const device: any = useCameraDevice('back', {physicalDevices: ['wide-angle-camera']})

  const camera = useRef<Camera>(null)
  const isShowingBox = useSharedValue(false)
  const [showModal, setShowModal] = useState(false)
  const qrValue = useSharedValue<String | null>('')

  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE])

  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ["qr", "code-128", 'ean-13'],
    regionOfInterest:{
      x: (width - width * 0.75) / 2,
      y: height * 0.25,
      width: width * 0.75,
      height: width * 0.75
    },
    onBarcodeScanned(barcodes, frame) {
      "worklet"

      barcodes.filter(barcode => {

        if (isShowingBox.value) {
          return
        }

        // const [topLeft, topRight, bottomRight, bottomLeft] = barcode.cornerPoints;

        // const top = (topLeft.y + topRight.y) / 2;
        // const left = (topLeft.x + bottomLeft.x) / 2;
        // const right = (topRight.x + bottomRight.x) / 2;
        // const bottom = (bottomLeft.y + bottomRight.y) / 2;

        // console.log(screenHeight, screenWidth)

        // const xRatio = frame.height / width
        // const yRatio = frame.width / height

        // console.log(barcode.cornerPoints)
        const [bottomLeft, bottomRight, topRight, topLeft] = barcode.cornerPoints;

        const top = (topLeft.y + topRight.y) / 2
        const left = (topLeft.x + bottomLeft.x) / 2
        const right = (topRight.x + bottomRight.x) / 2;
        const bottom = (bottomLeft.y + bottomRight.y) / 2;

        // console.log(width, height)

        // console.log('left:', ((screenWidth - screenWidth * 0.75) / 2)  + ' / ' + left)
        // console.log('top:', top)
        // console.log('right:', right)
        // console.log('bottom:', (screenHeight * 0.25 + screenWidth * 0.75)  + ' / ' + bottom)

        if (
          left > ((screenWidth - screenWidth * 0.75) / 2)
          && top > screenHeight * 0.25
          && right < (screenWidth - (screenWidth - screenWidth * 0.75) / 2) * 0.6
          && bottom < (screenHeight * 0.25 + screenWidth * 0.75)
        ) {
          console.log(barcode.value)
          qrValue.value = barcode.value

          isShowingBox.value = true
        }

        // console.log(width, height)
      })

    },
  })

  useEffect(() => {
    if (isShowingBox.value) {
      setShowModal(true)
    }
    else {
      setShowModal(false)
    }
  }, [isShowingBox.value])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Camera
        ref={camera}
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        {...cameraProps}
      // focusable={true}
      // frameProcessor={frameProcessor}
      // frameProcessorFps={5}
      />

      <Svg
        height='100%'
        width='100%'
      >
        <Defs>
          <Mask
            id='mask'
            x="0"
            y="0"
            height='100%'
            width='100%'
          >
            <Rect height='100%' width='100%' fill='#fff' />

            <Rect x={(width - width * 0.75) / 2} y={height * 0.25} fill='#000' width={width * 0.75} height={width * 0.75} />

          </Mask>
        </Defs>

        <Rect
          height='100%'
          width='100%'
          fill='rgba(0, 0, 0, 0.8)'
          mask='url(#mask)'
        />
        <Rect
          x={(width - width * 0.75) / 2}
          y={height * 0.25}
          width={width * 0.75}
          height={width * 0.75}
          strokeWidth='3'
          stroke='#fff'
          fill='transparent'
        />
      </Svg>

      {/* <View
        style={{
          position: 'absolute',
          borderColor: 'red',
          borderWidth: 1,
          top: "20%",
          left: "10%",
          width: "80%",
          aspectRatio: 1,
        }}
      /> */}

      <Modal
        transparent={true}
        visible={showModal}
        animationType='fade'
        onRequestClose={() => {
          setShowModal(false)
          isShowingBox.value = false
        }}
      >
        <Pressable
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
          onPress={() => {
            setShowModal(false)
            isShowingBox.value = false
          }}
        />

        <View
          style={{
            width: width * 0.8,
            height: height * 0.4,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: height / 2 - (height * 0.4) / 2,
            left: width / 2 - (width * 0.8) / 2,
            paddingVertical: 20,
            paddingHorizontal: 20,
            backgroundColor: '#fff'
          }}
        >
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
            Scanned: {qrValue.value}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              marginTop: 50,
              justifyContent: 'flex-end',
              width: '100%'
            }}
          >
          <TouchableOpacity onPress={() => {
            setShowModal(false)
            isShowingBox.value = false
          }}>
            <Text>OK</Text>
          </TouchableOpacity>
          
          {qrValue.value?.startsWith('http')
            ? 
            <TouchableOpacity onPress={() => {
              setShowModal(false)
              isShowingBox.value = false

              Linking.openURL(qrValue.value)
            }}>
              <Text>OPEN URL</Text>
            </TouchableOpacity>
            : null
          }
          </View>
        </View>

      </Modal>
    </SafeAreaView>
  )
}

export default QrScan
0