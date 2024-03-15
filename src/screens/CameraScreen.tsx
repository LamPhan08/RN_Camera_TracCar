import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import React, { useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Routes } from '../Routes/Routes'

type Props = NativeStackScreenProps<Routes, 'CameraScreen'>

const CameraScreen = ({ navigation }: Props) => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back')
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const camera = useRef<Camera>(null)

  const device: any = useCameraDevice(cameraPosition)



  const handleTakePhoto = async () => {
    const photo = await camera.current?.takePhoto()

    await CameraRoll.saveAsset(`file://${photo?.path}`, {
      type: 'photo',
    })
  }

  const handleRecordVideo = async () => {
    camera.current?.startRecording({
      async onRecordingFinished(video) {
        const path = video.path

        await CameraRoll.saveAsset(`file://${path}`, { type: 'video' })
      },

      onRecordingError(error) {
        console.log(error)
      },
    })

    setIsRecording(true)
  }

  const handlePauseVideo = async () => {
    await camera.current?.pauseRecording()

    setIsPaused(true)
  }

  const handleResumeVideo = async () => {
    await camera.current?.resumeRecording()

    setIsPaused(false)
  }

  const handleStopVideo = async () => {
    await camera.current?.stopRecording()

    setIsRecording(false)
  }

  const handleScanQr = () => {
    navigation.navigate('QrScan')
  }

  const handleCropImage = () => {
    navigation.navigate('CropImage')
  }

  const handleDetectCode = () => {
    navigation.navigate('CodeDetector')
  }


  return (
    <View style={{ flex: 1 }}>
      <Camera
        photo={true}
        isActive={true}
        device={device}
        ref={camera}
        style={StyleSheet.absoluteFill}
        video={true}
        audio={true}
        onError={err => console.log(err)}

      />

      <View style={{ position: 'absolute', top: 50, right: 5,  gap: 10}}>
        <TouchableOpacity onPress={handleScanQr} style={{ backgroundColor: 'red', borderRadius: 200, padding: 10}}>
          <MaterialCommunityIcons name='qrcode-scan' size={22} color='#fff' />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCropImage} style={{ backgroundColor: 'red', borderRadius: 200, padding: 10}}>
          <MaterialCommunityIcons name='crop-landscape' size={22} color='#fff' />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDetectCode} style={{ backgroundColor: 'red', borderRadius: 200, padding: 10}}>
          <MaterialCommunityIcons name='magnify-scan' size={22} color='#fff' />
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          gap: 10
        }}
      >
        <TouchableOpacity
          style={{
            padding: 20,
            borderRadius: 50,
            backgroundColor: 'red'
          }}
          onPress={handleTakePhoto}
        >
          <Text style={{ color: '#fff', fontWeight: '500' }}>
            Take Photo
          </Text>
        </TouchableOpacity>

        {!isRecording
          ?
          <TouchableOpacity
            style={{
              padding: 20,
              borderRadius: 50,
              backgroundColor: 'red'
            }}
            onPress={handleRecordVideo}
          >
            <Text style={{ color: '#fff', fontWeight: '500' }}>
              Record Video
            </Text>
          </TouchableOpacity>
          :
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={{
                padding: 20,
                borderRadius: 50,
                backgroundColor: 'red'
              }}
              onPress={isPaused ? handleResumeVideo : handlePauseVideo}
            >
              <Text style={{ color: '#fff', fontWeight: '500' }}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 20,
                borderRadius: 50,
                backgroundColor: 'red'
              }}
              onPress={handleStopVideo}
            >
              <Text style={{ color: '#fff', fontWeight: '500' }}>
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

export default CameraScreen
