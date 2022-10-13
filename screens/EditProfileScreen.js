import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable,TouchableOpacity} from 'react-native';
import React, { useState } from "react";
import { useEffect } from "react";

import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../FirebaseApp"
import { collection, addDoc } from "firebase/firestore"

const EditProfileScreen = () => {
  const [loggedInUser,setLoggedInUser] = useState('')
  useEffect(()=>{
        
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
        
        if (userFromFirebaseAuth) {
            console.log(userFromFirebaseAuth.email) 
            setLoggedInUser(userFromFirebaseAuth.email)   
        }
        else {
            setLoggedInUser(null)
            console.log("No user signed in")
        }
      })
      return listener
  }, [])
  const [studentIdFromUser, setStudentIdFromUser] = useState("");
  const [studentNameFromUser, setStudentNameFromUser] = useState("");

  const userInformation = async () => {
    
    if(setLoggedInUser == (null)){
        console.log ("no user logged in")
    } 
    else {
        const dataToInsert = {
            studentId:parseInt(studentIdFromUser),
            studentName:studentNameFromUser,
        }
        try {
            const insertedDocument =  await addDoc(collection(db, "users", loggedInUser, "data"), dataToInsert)
            console.log(`Document created, id is: ${insertedDocument.id}`)
            Alert.alert(`Insert Data Successful`)
        }
        catch (err) {
        console.log(`${err.message}`)
        }
        }
  };
  return (
    <SafeAreaView style={styles.container}>
       <Text style={styles.headingtext}> Update Your Profile </Text>
              
       <Text style={styles.inputtext}>Email:</Text>
        <TextInput 
          placeholder="Enter Email"
          textContentType="emailAddress"
          autoCapitalize="none"
          returnKeyType="next"
          value={loggedInUser}
          style={styles.inputbox}/>
        <Text style={styles.inputtext}>Name:</Text>
        <TextInput 
              placeholder="Enter Name"
              textContentType="emailAddress"
              autoCapitalize="none"
              returnKeyType="next"
              value={studentNameFromUser} onChangeText={setStudentNameFromUser}
              style={styles.inputbox}/>
              <Text style={styles.inputtext}>Student ID:</Text>
  
              <TextInput 
              placeholder="Enter Student ID"
              returnKeyType="done"
              value={studentIdFromUser} 
              onChangeText={setStudentIdFromUser}
              style={styles.inputbox}/>
                
              <TouchableOpacity>
                  <Text style={styles.newacctouchable} onPress={userInformation}>Update Info</Text>
              </TouchableOpacity>
    </SafeAreaView>);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeading : {
      fontSize: 30,
      fontWeight: "400",
  },
  formContainer : {
      alignSelf: 'stretch',
      marginHorizontal: 20,
      marginTop:10,
      marginBottom: 30,
  },
  formLabel : {
      fontWeight: "bold"
  },
  inputStyle : {
      marginVertical: 15,
      height:48,
      padding:15,
      borderColor: '#888',
      borderRadius:10,
      borderWidth:1
  }, 
  loginButton : {
      backgroundColor: "#001C00",
      alignSelf:"stretch",
      padding:16,
      marginHorizontal:20,
      alignItems:"center",
      marginBottom:30,
      borderRadius:10,
  },
  buttonText : {
      color:"#C5F277",
      fontSize: 18,
      fontWeight: "bold"
  },  
  signUpButton : {
      alignSelf:"stretch",
      marginHorizontal:10,
      alignItems:"center",
      padding: 16,
  },  
  signUpText : {
      color:"#001C00",
      fontSize: 18,
      fontWeight: "bold"
  },
  errors : {
      alignSelf:"stretch",
      padding:10,
      marginHorizontal:20,
      backgroundColor: "#C63461",
      marginBottom: 20,
  }, 
  errorText: {
      color:"white"
  },
  forgotPassword: {
      fontSize: 12,
  },
  textDanger: {
      color: "#dc3545"
  }
});
export default EditProfileScreen;
