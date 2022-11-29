import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Pressable,
  Image,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { auth } from "../../FirebaseApp";
import { db } from "../../FirebaseApp";
import { CommonActions } from "@react-navigation/native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { async } from "@firebase/util";

const SettingsScreen = ({ navigation, route }) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [image, setImage] = useState(null);
  const termsURL = "https://budgetify-landing.vercel.app/terms-and-conditions";
  const privacyURL = "https://budgetify-landing.vercel.app/privacy-policy";

  useEffect(() => {
    checkForCameraRollPermission();
    const listener = onAuthStateChanged(auth, async (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        // console.log(userFromFirebaseAuth.email);
        setLoggedInUser(userFromFirebaseAuth.email);
        const docRef = doc(db, "users", userFromFirebaseAuth.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setImage(docSnap.data().icon);
        }
      } else {
        setLoggedInUser(null);
        console.log("No user signed in");
      }
    });

    return listener;
  }, []);

  const accountList = [
    {
      text: "Change Password",
      screen: "ChangePassword",
    },
  ];

  const preferencesList = [
    {
      text: "Manage Categories",
      screen: "ManageCategories",
    },
    {
      text: "Terms & Conditions",
      url: termsURL,
    },
    {
      text: "Privacy Policy Agreement",
      url: privacyURL,
    },
  ];

  const editProfile = async () => {
    console.log(`Edit Profile Pressed!`);
    // Navigate to Edit Profile
    navigation.navigate("Edit Your Profile");
  };

  const deleteAccount = async () => {
    console.log(`Delete Account Pressed!`);
    Alert.alert("Delete Account", "Are you sure to delete the account?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          console.log("OK Pressed");
          const listener = onAuthStateChanged(auth, async (user) => {
            if (user) {
              user
                .delete()
                .then(async () => {
                  var docRef = doc(db, "users", loggedInUser);
                  var docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                    await deleteDoc(doc(db, "users", loggedInUser));
                    console.log("Document deleted", loggedInUser);
                    Alert.alert(
                      "Delete Account",
                      "Deletion Successful. Signing Out!",
                      [
                        {
                          text: "Ok",
                          onPress: async () => {
                            console.log("Ok Pressed");
                            await signOut(auth);
                            console.log("User signed out");
                            //reset the navigation state after logged out
                            navigation.dispatch(
                              CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                              })
                            );
                          },
                        },
                      ]
                    );
                  } else {
                    console.log("User Not Found");
                  }
                })
                .catch((error) => console.log(error));
            }
          });
          return listener;
        },
      },
    ]);
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

  const OpenURLButton = async (url) => {
    // console.log(`Opening ${url}`)
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      console.log(`Opening ${url}`);
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        {
          item.screen && navigation.navigate(item.screen);
        }
        {
          item.url && OpenURLButton(item.url);
        }
      }}
    >
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.settingText}> {item.text} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textHeading}>Settings</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.imgContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
              <Text>{image ? "Edit" : "Upload"} Image</Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userEmail}>{loggedInUser}</Text>
          <Pressable style={styles.editPressable} onPress={editProfile}>
            <Ionicons style={styles.editIcon} name="create-outline" size={25} />
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.subHeading}>Account</Text>
      <FlatList data={accountList} renderItem={renderItem} />
      <Text style={styles.subHeading}>Preferences</Text>
      <FlatList data={preferencesList} renderItem={renderItem} />
      <Pressable style={styles.deleteAccountPressable}>
        <Text style={styles.deleteAccountText} onPress={deleteAccount}>
          Delete Account
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#D6D6D6",
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  textHeading: {
    fontSize: 22,
    paddingLeft: 15,
    fontFamily: "Montserrat_700Bold",
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center",
    margin: "auto",
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  imgContainer: {
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    marginLeft: 10,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "40%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userEmail: {
    color: "#1A191C",
    fontSize: 19,
    marginLeft: 20,
    paddingBottom: 10,
  },
  profileIcon: {
    padding: 8,
  },
  editPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A191C",
    marginLeft: 20,
    marginRight: 200,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
  },
  editIcon: {
    color: "#C5F277",
  },
  editText: {
    color: "#C5F277",
    fontSize: 15,
  },
  deleteAccountPressable: {
    backgroundColor: "#FCE8E8",
    padding: 10,
    marginTop: 10,
    margin: 70,
  },
  deleteAccountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC6B6B",
    textAlign: "center",
  },
});

export default SettingsScreen;
