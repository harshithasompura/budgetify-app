import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";

import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../FirebaseApp";
import { collection, addDoc } from "firebase/firestore";

const EditProfileScreen = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
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
  const [studentIdFromUser, setStudentIdFromUser] = useState("");
  const [studentNameFromUser, setStudentNameFromUser] = useState("");

  const userInformation = async () => {
    if (setLoggedInUser == null) {
      console.log("no user logged in");
    } else {
      const dataToInsert = {
        studentId: parseInt(studentIdFromUser),
        studentName: studentNameFromUser,
      };
      try {
        const insertedDocument = await addDoc(
          collection(db, "users", loggedInUser, "studentdata"),
          dataToInsert
        );
        console.log(`Document created, id is: ${insertedDocument.id}`);
        Alert.alert(`Insert Data Successful`);
      } catch (err) {
        console.log(`${err.message}`);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenHeading}> Student Information </Text>

      <Text style={styles.inputtext}>Email:</Text>
      <TextInput
        placeholder="Enter Email"
        textContentType="emailAddress"
        autoCapitalize="none"
        returnKeyType="next"
        value={loggedInUser}
        style={styles.inputbox}
      />
      <Text style={styles.inputtext}>Username:</Text>
      <TextInput
        placeholder="Enter Username"
        autoCapitalize="none"
        returnKeyType="next"
        value={studentNameFromUser}
        onChangeText={setStudentNameFromUser}
        style={styles.inputbox}
      />
      
      <Text style={styles.inputtext}>Student ID:</Text>

      <TextInput
        placeholder="Enter Student ID"
        returnKeyType="done"
        value={studentIdFromUser}
        onChangeText={setStudentIdFromUser}
        style={styles.inputbox}
      />

      <TouchableOpacity>
        <Text style={styles.addInfoPress} onPress={userInformation}>
          Add Student Information
        </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    backgroundColor: '#fff',
    
  },
  screenHeading: {
    fontSize:25,
    alignContent:'center',
    textAlign: 'center',
    margin:5, 
   fontWeight:"bold",
    fontFamily: "IBMPlexMono_500Medium", 
    textDecorationLine: 'underline'
     
  },
  inputtext:{
    alignContent:'flex-start',
    marginHorizontal:10,
    fontSize:17,
    fontFamily: "IBMPlexMono_500Medium", 

},
inputbox:{
    alignContent:'flex-start',
    borderColor:'#888888',
    borderWidth:1,
    margin:10,
    padding:10,
    height:45,
    fontSize:15,
    fontFamily: "IBMPlexMono_500Medium", 

},
addInfoPress:{
  textAlign: 'center',
  color:'red',
  margin:10,
  padding:10,
  height:45,
  fontSize:20,
  borderWidth:1,
  color: "#C5F277",
  backgroundColor:'black',
  alignContent:'center',
  fontWeight:"bold",
  fontFamily: "IBMPlexMono_500Medium", 

},
});
export default EditProfileScreen;
