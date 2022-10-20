import { FlatList, StyleSheet, TouchableOpacity, Text, View, Pressable, Image} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useEffect, useState } from "react";
import { auth } from "../FirebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SettingsScreen = ({ navigation, route }) => {

  const [loggedInUser, setLoggedInUser] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    checkForCameraRollPermission()
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        console.log(userFromFirebaseAuth.email);
        setLoggedInUser(userFromFirebaseAuth.email);
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
      text: "Manage Currencies",
      screen: "ManageCurrencies",
    },
    {
      text: "Notifications",
      screen: "Notifications",
    },
  ];

  const editProfile = async () => {
    console.log(`Edit Profile Pressed!`);
    // Navigate to Edit Profile
    navigation.navigate("Edit Your Profile");
  };

  const deleteAccount = async () => {
    console.log(`Delete Account Pressed!`);
  };

  const addImage = async() => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });
    console.log(JSON.stringify(_image));
    if (!_image.cancelled) {
      setImage(_image.uri);
    }
  };

  const  checkForCameraRollPermission=async()=>{
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Please grant camera roll permissions inside your system's settings");
    }else{
      console.log('Media Permissions are granted')
    }
}

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.screen);
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
      <View style={{flexDirection: "row"}}>
      <View style={styles.imgContainer}>
        {
            image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        }
        <View style={styles.uploadBtnContainer}>
            <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
        </View>
      </View>
        <View style={{flexDirection: "column"}}>
          <Text style= {styles.userEmail}>{loggedInUser}</Text>
          <Pressable style= {styles.editPressable} onPress={editProfile}>
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
        <Text style={styles.deleteAccountText} onPress={deleteAccount}>Delete Account</Text>
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
    paddingBottom: 15 ,
    paddingLeft: 15
  },
  textHeading: {
    fontSize: 25,
    paddingLeft: 15,
    fontWeight: "bold",
    paddingTop: 15,
    paddingBottom: 15,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  imgContainer:{
    elevation:2,
    height:100,
    width:100,
    backgroundColor:'#efefef',
    position:'relative',
    borderRadius:999,
    overflow:'hidden',
    marginLeft: 10,
  },
  uploadBtnContainer:{
    opacity:0.7,
    position:'absolute',
    right:0,
    bottom:0,
    backgroundColor:'lightgrey',
    width:'100%',
    height:'40%',
  },
  uploadBtn:{
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
  },
  userEmail: {
    color:"#1A191C",
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
    textAlign: "center"
  }
});

export default SettingsScreen;