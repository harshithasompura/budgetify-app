import React, { useState, useEffect, useRef } from "react";
import * as FileSystem from "expo-file-system";
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
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

const CameraScreen = ({ navigation, route }) => {
  // - State Variables
  //1. Camera Permissions
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermissions, setCameraPermissions] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  const [loading, setLoading] = useState(false);

  // url parameters
  const { userEmail } = route.params;

  const localBase = "http://localhost:3000/binary-upload/";
  const remoteBase = "https://node-scan.onrender.com/binary-upload/";
  const vercelApi = "https://budgetify-landing.vercel.app/binary-upload/";

  const scanReceipt = async (imageUri, endpointNum) => {
    console.log("Trying endpoint " + endpointNum);
    //send image to web api hosted on Render for text recognition
    const endpointLink = vercelApi + endpointNum;

    const response = await FileSystem.uploadAsync(endpointLink, imageUri, {
      fieldName: "file",
      httpMethod: "PATCH",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    //data parsed from image
    return JSON.parse(response.body);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0,
        });

        const manipResult = await manipulateAsync(data.uri, [], {
          compress: 0,
        });

        console.log(manipResult);
        setImage(manipResult.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //this func is used to simulate an imageScan process
  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Edit Expenses", {
        imageUri: image,
        userEmail: userEmail,
      });
    }, 3000);
  };

  //a real image scan function
  const confirmBtnPressed = async () => {
    setLoading(true);
    for (let i = 1; i <= 3; i++) {
      let jsonObject = await scanReceipt(image, i);
      // console.log(i + " endpointed actual: " + jsonObject["success"]);
      if (jsonObject["success"]) {
        //data parsed from image
        // console.log(jsonObject);

        const receipt = jsonObject["receipts"][0];
        setLoading(false);
        navigation.navigate("Edit Expenses", {
          imageUri: image,
          merchant: receipt["merchant_name"],
          total: receipt["total"],
          receiptDate: receipt["date"],
          userEmail: userEmail
        });
        return;
      }
      console.log("endpoint " + i + " failed...");
    }
    console.log("All endpoints failed!");
    setLoading(false);
    navigation.navigate("Edit Expenses", {
      imageUri: image,
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
      {image !== null ? (
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <Image source={{ uri: image }} style={{ flex: 1 }}></Image>
          {loading && (
            <View style={styles.indicator}>
              <ActivityIndicator
                size="large"
                color="#000000"
                animating={loading}
                style={{ alignSelf: "center", marginLeft: 3, marginTop: 2 }}
              />
            </View>
          )}
          {!loading && (
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setImage(null);
              }}
            >
              {/* <Text style={{color:"#C5F277"}}>Save</Text> */}
              <Icon name="times-circle" color={"white"} size={30} />
            </Pressable>
          )}

          {!loading && (
            <Pressable style={styles.confirmButton} onPress={startLoading}>
              {/* <Text style={{color:"#C5F277"}}>Save</Text> */}
              <Icon name="check" color={"white"} size={30} />
            </Pressable>
          )}
        </View>
      ) : (
        <Camera style={styles.actualCamera} type={type} ref={cameraRef}>
          {/* <Text>[CAPTURE]</Text> */}
          <Pressable style={styles.saveButton} onPress={takePicture}>
            {/* <Text style={{color:"#C5F277"}}>Save</Text> */}
            <Icon name="camera" color={"white"} size={20} />
          </Pressable>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              navigation.popToTop();
            }}
          >
            <Ionicons name="arrow-back-sharp" size={40} color="#62D3B4" />
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
    // borderRadius: 10,
    flex: 1,
    // flexDirection: "column",
    position: "relative",
  },
  saveButton: {
    margin: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#62D3B4",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    margin: 20,
    width: 70,
    height: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  cancelButton: {
    margin: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#62D3B4",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  confirmButton: {
    margin: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#62D3B4",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
  },
  capturedImage: {
    height: "100%",
    width: "100%",
  },
  indicator: {
    position: "absolute",
    alignSelf: "center",
    marginVertical: 350,
    backgroundColor: "#62D3B4",
    borderRadius: 40,
    padding: 10,
  },
});

export default CameraScreen;
