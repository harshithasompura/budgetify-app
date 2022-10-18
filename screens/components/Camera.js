import React, { useState, useEffect, useRef } from "react";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const CameraScreen = ({ navigation }) => {
  // - State Variables
  //1. Camera Permissions
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermissions, setCameraPermissions] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  // - Event Listeners
  const onCameraButtonPressed = () => {
    console.log(`Camera Button Pressed!`);
    setCameraVisible(true);
    setCloseCamera(true);
  };

  const onCameraClosePressed = () => {
    setCameraVisible(false);
    setCloseCamera(false);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // - Lifecycle Hooks
  useEffect(() => {
    (async () => {
      // Ask for camera permissions
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermissions(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermissions === false) {
    <Text>No Camera Permissions</Text>;
  }

  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Camera</Text> */}
      {closeCamera && (
        <Pressable
          onPress={onCameraClosePressed}
          style={{ marginHorizontal: 20 }}
        >
          <Icon name="close" size={20} />
        </Pressable>
      )}
      <Camera style={styles.actualCamera} type={type} ref={cameraRef}>
        <Text>[CAPTURE]</Text>
      </Camera>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  actualCamera: {
    borderRadius: 10,
    flex: 1,
  },
});

export default CameraScreen;
