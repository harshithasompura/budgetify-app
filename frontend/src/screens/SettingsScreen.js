import { FlatList, StyleSheet, TouchableOpacity, Text, View, Pressable, Image, Alert, Linking,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { auth } from "../../FirebaseApp";
import { db } from "../../FirebaseApp";
import { CommonActions } from "@react-navigation/native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

const SettingsScreen = ({ navigation, route }) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userName, setUserName] = useState();
  const [image, setImage] = useState(null);
  const termsURL = "https://budgetify-landing.vercel.app/terms-and-conditions";
  const privacyURL = "https://budgetify-landing.vercel.app/privacy-policy";

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        // console.log(userFromFirebaseAuth.email);
        setLoggedInUser(userFromFirebaseAuth.email);
        const docRef = doc(db, "users", userFromFirebaseAuth.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setImage(docSnap.data().icon); 
          setUserName(docSnap.data().username);
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
      text: "Privacy Policy",
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
                      [{
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
                              }));},},]);} else {
                    console.log("User Not Found");
                  }})
                .catch((error) => console.log(error));
            }});
          return listener;
        },},]);};  

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
      <View style={{ flexDirection: "column" }}>
        <View style={styles.imgContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
          )} 
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userEmail}>{userName}</Text>
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
    fontSize: 14,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    fontFamily: "Montserrat_400Regular",
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
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat_600SemiBold",
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 5,
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
    bottom: 70,
    backgroundColor: "lightgrey",
    width: "13%",
    height: "30%",
    borderRadius: 40,
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userEmail: {
    color: "#1A191C",
    alignSelf: "center",
    fontSize: 19,
    paddingBottom: 10,
    marginVertical: 6,
  },
  profileIcon: {
    padding: 8,
  },
  editPressable: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CDFE5C",
    alignSelf: "center",
    padding: 10,
    marginVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  editIcon: {
    color: "#001c00",
  },
  editText: {
    color: "#001c00",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 15,
  },
  deleteAccountPressable: {
    backgroundColor: "#FCE8E8",
    marginHorizontal: 80,
    marginVertical: 30,
    borderRadius: 24,
    paddingVertical: 14,
  },
  deleteAccountText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC6B6B",
    textAlign: "center",
  },
});

export default SettingsScreen;
