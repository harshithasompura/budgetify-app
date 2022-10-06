import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable} from 'react-native';
// Importing fonts
import { useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono'
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const ExpensesScreen = () => {
  // - State Variables
  //1. Camera Permissions
  const [hasCameraPermissions, setCameraPermissions] = useState(false);
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null)

  // - Event Listeners
  const onCameraButtonPressed = () => {
      console.log(`Camera Button Pressed!`)
      setCameraVisible(true);
      setCloseCamera(true);
  }

  const onCameraClosePressed = () => {
    setCameraVisible(false);
    setCloseCamera(false);
  }

  // - Lifecycle Hooks
  useEffect(() => {
    (async () => {
      // Ask for camera permissions
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermissions(cameraStatus.status === 'granted');
    })();
  }, []);

  let [fontsLoaded] = useFonts({ IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold, IBMPlexMono_700Bold,})
  if (!fontsLoaded) {
      return <Text>Fonts are loading...</Text>
  } else {
  
  // ------------------------ View Template -----------------------

  const takePicture = async () => {
    if(cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri)
      } catch(error){
        console.log(error)
      }
    }
  }

  if (hasCameraPermissions === false){
    <Text>No Camera Permissions</Text>
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={[styles.screenHeading ,{fontFamily:"IBMPlexMono_500Medium"} ]}>Expenses</Text>
        {closeCamera &&
          <Pressable onPress={onCameraClosePressed} style={{marginHorizontal:20}}>
          <Icon name="close" size={20} />
        </Pressable>
        }
      </View>
        {!isCameraVisible && 
         <Pressable style={styles.camera} onPress={onCameraButtonPressed}>
          <Icon name="camera" size={20} />
       </Pressable>
        }
        {isCameraVisible &&
        <Camera
          style ={styles.actualCamera}
          type={type}
          ref={cameraRef}
         >
          <Text>[CAPTURE]</Text>
        </Camera>
        }
      
    </SafeAreaView>
  )
}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#fff",
    flex: 1,
  },
  screenHeading : {
      fontSize: 30,
      fontWeight: "400",
      marginVertical:30,
      marginHorizontal:30,
  },
  camera:{
    alignSelf:'flex-end',
    marginVertical:-60,
    marginHorizontal:30,
  },
  actualCamera : {
    flex:1,
    borderRadius:10,
  }
});

export default ExpensesScreen