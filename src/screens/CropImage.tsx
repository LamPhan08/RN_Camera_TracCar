import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Platform, Dimensions, Modal, Pressable, Image } from 'react-native'
import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera'
import { crop, type CropRegion } from 'vision-camera-cropper'
import { Svg, Rect, Defs, Mask, } from 'react-native-svg'
import { useSharedValue } from 'react-native-worklets-core'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'

const CropImage = () => {
  const device: any = useCameraDevice('back')

  const camera = useRef<Camera>(null)

  const [frameWidth, setFrameWidth] = useState(1920);
  const [frameHeight, setFrameHeight] = useState(1080);
  const [cropRegion, setCropRegion] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100
  });
  const [imageData, setImageData] = useState<undefined | string>(undefined);

  const cropRegionShared = useSharedValue<undefined | CropRegion>(undefined);
  const taken = useSharedValue(false);
  const shouldTake = useSharedValue(false);
  const img = useSharedValue<String | undefined>('');

  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: 30 }
  ])

  const HasRotation = () => {
    let value = false
    if (Platform.OS === 'android') {
      if (!(frameWidth > frameHeight && Dimensions.get('window').width > Dimensions.get('window').height)) {
        value = true;
      }
    }
    return value;
  }

  const getFrameSize = (): { width: number, height: number } => {
    let width: number, height: number;
    if (HasRotation()) {
      width = frameHeight;
      height = frameWidth;
    } else {
      width = frameWidth;
      height = frameHeight;
    }
    return { width: width, height: height };
  }

  const updateFrameSize = (width: number, height: number) => {
    if (width != frameWidth && height != frameHeight) {
      setFrameWidth(width);
      setFrameHeight(height);
    }
  }

  const updateCropRegion = () => {
    const size = getFrameSize();
    let region;
    if (size.width > size.height) {
      let regionWidth = 0.7 * size.width;
      let desiredRegionHeight = regionWidth / (85.6 / 54);
      let height = Math.ceil(desiredRegionHeight / size.height * 100);
      region = {
        left: 15,
        width: 70,
        top: 10,
        height: height
      };
    } else {
      let regionWidth = 0.8 * size.width;
      let desiredRegionHeight = regionWidth / (85.6 / 54);
      let height = Math.ceil(desiredRegionHeight / size.height * 100);
      region = {
        left: 10,
        width: 80,
        top: 20,
        height: height
      };
    }
    setCropRegion(region);
    cropRegionShared.value = region;

    // console.log("cropRegionShared.value:",  cropRegionShared.value)
  }



  const updateFrameSizeJS = Worklets.createRunInJsFn(updateFrameSize);
  const setImageDataJS = Worklets.createRunInJsFn(setImageData);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    updateFrameSizeJS(frame.width, frame.height);
    if (taken.value == false && shouldTake.value == true && cropRegionShared.value != undefined) {
      console.log('frame:', frame);
      const result = crop(frame, { cropRegion: cropRegionShared.value, saveAsFile: true, includeImageBase64: true });
      // console.log('result:', result.path);
      if (result.base64) {
        setImageDataJS("data:image/jpeg;base64," + result.base64);
        // setImageDataJS(result.path);
        taken.value = true;

        // runAsync(frame, async () => {
        //   'worklet'
        //    CameraRoll.saveAsset(`file://${result.path}`)
        // })
        img.value = result.path
      }
      shouldTake.value = false;
    }
  }, [])

  const handleTakePhoto = async () => {
    shouldTake.value = true;
  }

  const renderImage = () => {
    if (imageData != undefined) {
      return (
        // <Svg style={styles.srcImage} viewBox={getViewBoxForCroppedImage()}>
        //   <Image
        //     href={{uri:imageData}}

        //   />
        // </Svg>
        <Image
          source={{ uri: imageData }}
          style={styles.srcImage}
        />
      );
    }
    return null;
  }

  const getViewBox = () => {
    const frameSize = getFrameSize();
    console.log("getViewBox");
    console.log(frameSize);
    const viewBox = "0 0 " + frameSize.width + " " + frameSize.height;
    return viewBox;
  }

  const getViewBoxForCroppedImage = () => {
    const frameSize = getFrameSize();
    const viewBox = "0 0 " + (frameSize.width * cropRegion.width / 100) + " " + (frameSize.height * cropRegion.height / 100);
    return viewBox;
  }

  useEffect(() => {
    updateCropRegion();
  }, [frameWidth, frameHeight])

  useEffect(() => {
    if (imageData) {
      CameraRoll.saveAsset(`file://${img.value}`, { type: 'photo', })
    }
  }, [img.value])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      

      <Camera
        isActive={true}
        device={device}
        ref={camera}
        photo={true}
        format={format}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        pixelFormat='yuv'
      />

      <Svg height='100%' width='100%'>
        <Defs>
          <Mask
            id='mask'
            x='0'
            y='0'
            height='100%'
            width='100%'
          >
            <Rect height='100%' width='100%' fill='#fff' />

            <Svg preserveAspectRatio={'xMidYMid slice'} style={StyleSheet.absoluteFill} viewBox={getViewBox()}>
              <Rect
                x={cropRegion.left / 100 * getFrameSize().width}
                y={cropRegion.top / 100 * getFrameSize().height}
                width={cropRegion.width / 100 * getFrameSize().width}
                height={cropRegion.height / 100 * getFrameSize().height}
                strokeWidth="5"
                stroke="red"

              />
            </Svg>
          </Mask>
        </Defs>

        <Rect
          height='100%'
          width='100%'
          fill='#000'
          mask='url(#mask)'
        />

        <Svg preserveAspectRatio={'xMidYMid slice'} style={StyleSheet.absoluteFill} viewBox={getViewBox()}>
          <Rect
            x={cropRegion.left / 100 * getFrameSize().width}
            y={cropRegion.top / 100 * getFrameSize().height}
            width={cropRegion.width / 100 * getFrameSize().width}
            height={cropRegion.height / 100 * getFrameSize().height}
            strokeWidth="5"
            stroke="#fff"
            fill='transparent'
          />
        </Svg>
      </Svg>

      <View 
      style={{
          position: 'absolute',
          top: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          gap: 10
        }}>
      <Text style={{fontSize: 20, color: '#fff'}}>Chụp trong khung hình</Text>
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
            padding: 5,
            borderRadius: 50,
            borderColor: '#fff',
            borderWidth: 1
          }}
          onPress={handleTakePhoto}
        >
          <View style={{width: 50, height: 50, backgroundColor: '#fff', borderRadius: 50}}/>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={(imageData != undefined)}
        onRequestClose={() => {
          setImageData(undefined);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {renderImage()}
            <View style={styles.buttonView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setImageData(undefined);
                  taken.value = false;
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default CropImage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  control: {
    flexDirection: "row",
    position: 'absolute',
    bottom: 0,
    height: "10%",
    width: "100%",
    alignSelf: "flex-start",
    borderColor: "white",
    borderWidth: 0.1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonView: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  srcImage: {
    width: Dimensions.get('window').width * 0.8,
    height: 300,
    resizeMode: "contain"
  },
});