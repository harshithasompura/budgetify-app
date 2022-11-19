import React, { useState, useEffect, useRef } from "react";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Image,
  Pressable,
  Touchable,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { TouchableOpacity } from "react-native-gesture-handler";
import { async } from "@firebase/util";
// import storage from '@react-native-firebase/storage';r
import { db } from "../../FirebaseApp";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
        await addDoc(collection(db, "receipts"), {
          receiptURL: data.uri,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePictureToStorage = async () => {
    console.log(`Saving to Firestore`);
    const reference = storage().ref("receipt-001.png");
    const task = reference.putFile(image);
    task.on("state_changed", (taskSnapshot) => {
      console.log(`${taskSnapshot.bytesTransferred} transferred 
        out of ${taskSnapshot.totalBytes}`);
    });
    task.then(() => {
      console.log("Image uploaded to the bucket!");
    });
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
      {image !== null ? (
        <Image source={{ uri: image }} style={{ flex: 1 }} />
      ) : (
        <Camera style={styles.actualCamera} type={type} ref={cameraRef}>
          {/* <Text>[CAPTURE]</Text> */}
          <Pressable style={styles.saveButton} onPress={takePicture}>
            {/* <Text style={{color:"#C5F277"}}>Save</Text> */}
            <Icon name="camera" color={"#C5F277"} size={20} />
          </Pressable>
        </Camera>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  actualCamera: {
    borderRadius: 10,
    flex: 1,
    flexDirection: "column",
  },
  saveButton: {
    margin: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#001c00",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  capturedImage: {
    height: "100%",
    width: "100%",
  },
});

export default CameraScreen;
