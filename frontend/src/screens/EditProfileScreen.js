import { StyleSheet, Text, SafeAreaView, TextInput, View, TouchableOpacity, Image,} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../FirebaseApp";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const EditProfileScreen = ({ navigation }) => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [studentId, setStudentId] = useState();
  const [studentName, setStudentName] = useState();
  const [userName, setUserName] = useState();
  const [image, setImage] = useState(null);

  useEffect(() => {
    checkForCameraRollPermission();
    const listener = onAuthStateChanged(auth, async(userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        console.log(userFromFirebaseAuth.email);
        setLoggedInUser(userFromFirebaseAuth.email);
        const userDoc = doc(db,"users", userFromFirebaseAuth.email) ;
        console.log(userDoc);
        var docSnap = await getDoc(userDoc);
        console.log("doc",docSnap.data());
        //console.log("doc",docSnap.data().name);
        //console.log("doc",docSnap.data().studentid);
        setStudentName(docSnap.data().studentname);
        setUserName(docSnap.data().username)
        setStudentId(docSnap.data().studentid);
        setImage(docSnap.data().icon);        
      } else {
        console.log("No user signed in");
      }
    });
    return listener;
  }, []);
  
  const updateUserInfo = async (newStudentName, newUserName, newStudentID) => {
    if (!loggedInUser) {
      console.log("no user logged in");
      return;
    }

    const userRef = doc(db, "users", loggedInUser);
    await updateDoc(userRef, {
      studentname: newStudentName,
      username: newUserName,
      studentid: newStudentID,
    });
    navigation.goBack();
    alert("Updated User Details");
  };

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
    });
    console.log(JSON.stringify(_image));
    if (!_image.cancelled) {
      setImage(_image.uri);
      uploadImageToCloud(_image.uri, loggedInUser);
    }
  };

  const uploadImageToCloud = async (imageUri, userId) => {
    const response = await fetch(imageUri);
    const file = await response.blob();
    const storage = getStorage();
    const filename = userId;
    const imgRef = ref(storage, `userAvatars/${filename}`);

    try {
      await uploadBytes(imgRef, file);
      const avatarUrl = await getDownloadURL(imgRef);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        icon: avatarUrl,
      });

      alert("Updated Avatar");
    } catch (err) {
      console.log(err);
    }
  };

  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Please grant camera roll permissions inside your system's settings"
      );
    } else {
      console.log("Media Permissions are granted");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenHeading}> Edit Profile </Text>
      <View style={{ flexDirection: "column" }}>
      <View style={styles.imgContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
          )}
          
        </View>
        <View style={styles.uploadBtnContainer}>
            <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
              <AntDesign name="camera" size={30} color="black" />
            </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.inputtext}>Full Name</Text>
      <TextInput
        placeholder="Enter FullName"
        autoCapitalize="none"
        returnKeyType="next"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.inputbox}
      />

      <Text style={styles.inputtext}>Email</Text>
      <TextInput
        placeholder="Enter Email"
        textContentType="emailAddress"
        autoCapitalize="none"
        returnKeyType="next"
        value={loggedInUser}
        style={styles.inputbox}
      />
      <Text style={styles.inputtext}>Username</Text>
      <TextInput
        placeholder="Enter Username"
        autoCapitalize="none"
        returnKeyType="next"
        value={userName}
        onChangeText={setUserName}
        style={styles.inputbox}
      />

      <Text style={styles.inputtext}>Student ID</Text>
      <TextInput
        placeholder="Enter Student ID"
        returnKeyType="done"
        value={studentId}
        onChangeText={setStudentId}
        style={styles.inputbox}
      />

      <TouchableOpacity>
        <Text
          style={styles.addInfoPress}
          onPress={() => {
            updateUserInfo(studentName, userName, studentId);
          }}
        >
          Add Student Information
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenHeading: {
    fontSize: 25,
    alignContent: "center",
    textAlign: "center",
    margin: 5,
    fontWeight: "bold",
    fontFamily: "IBMPlexMono_500Medium",
  },
  imgContainer: {
    elevation: 2,
    height: 100,
    width: 100,
    alignSelf: "center",
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    marginLeft: 10,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  uploadBtnContainer: {
    opacity: 0.8,
    position: "absolute",
    alignSelf: "center",
    justifyContent:"center",
    right: 130,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "13%",
    height: "50%",
    borderRadius: 40,
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputtext: {
    alignContent: "flex-start",
    marginHorizontal: 10,
    fontSize: 17,
    fontFamily: "IBMPlexMono_500Medium",
  },
  inputbox: {
    alignContent: "flex-start",
    borderColor: "#888888",
    borderRadius: 8,
    borderWidth: 1,
    margin: 10,
    padding: 10,
    height: 45,
    fontSize: 15,
    fontFamily: "IBMPlexMono_500Medium",
  },
  addInfoPress: {
    textAlign: "center",
    color: "red",
    margin: 10,
    padding: 10,
    height: 45,
    fontSize: 20,
    borderWidth: 1,
    color: "#C5F277",
    backgroundColor: "black",
    alignContent: "center",
    fontWeight: "bold",
    fontFamily: "IBMPlexMono_500Medium",
  },
});

export default EditProfileScreen;
