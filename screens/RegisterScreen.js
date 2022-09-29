import React from "react";
import { useState } from "react";
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable, TouchableOpacity, Alert} from 'react-native';
const RegisterScreen = () => {
  
  //NEED TO CONNECT FIREBASE DB AND ADD FIREBASE AUTH
  
//    const createAccountPressed = async () => {
//         console.log("Create account button pressed")
//         console.log(`Provided name : ${nameFromUI}`)
//         console.log(`Provided email address: ${emailAddressFromUI}`)
//         console.log(`Provided password: ${passwordFromUI}`)
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth,nameFromUI, emailAddressFromUI, passwordFromUI)
//             console.log("Account creation success")
//             console.log(userCredential)
//             //addUserToDB()

//             console.log("Add button pressed")
    
//             Alert.alert("Account created!")
//             setnameFromUI("")
//             setEmailAddresFromUI("")
//             setPasswordFromUI("")
//         } catch (err) {
//             Alert.alert(`Error when creating user: ${err.code}, Message: ${err.message}`)
//             console.log("Error when creating user")
//             console.log(`Error code: ${err.code}`)
//             console.log(`Error message: ${err.message}`)
//         }
//       }
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.headingtext}> Create Your Account </Text>
            <Text style={styles.inputtext}>Name:</Text>

            <TextInput 
            placeholder="Enter Name"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType="next"
            value={nameFromUI}
            onChangeText={setnameFromUI} 
            style={styles.inputbox}/>

            <Text style={styles.inputtext}>Email:</Text>

            <TextInput 
            placeholder="Enter Email"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType="next"
            value={emailAddressFromUI}
            onChangeText={setEmailAddresFromUI} 
            style={styles.inputbox}/>

            <Text style={styles.inputtext}>Password:</Text>

            <TextInput 
            placeholder="Enter Password"
            textContentType="password"
            autoCapitalize="none"
            returnKeyType="done"
            secureTextEntry={true} 
            value={passwordFromUI}
            onChangeText={setPasswordFromUI} 
            style={styles.inputbox}/>
              
            <TouchableOpacity>
                <Text style={styles.newacctouchable} onPress={createAccountPressed}>Create New Account</Text>
            </TouchableOpacity>

    </SafeAreaView>
  )
}
export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        justifyContent:'center'
    },
    headingtext:{
        fontSize:25,
        marginBottom:15,
        textDecorationLine:'underline',
        alignContent:'center',
        textAlign: 'center',
        margin:5 
    },
    text:{
        fontSize:20,
        alignContent:'center',
        textAlign: 'center',
        marginBottom:15, 
    },
    inputtext:{
        alignContent:'flex-start',
        marginHorizontal:20,
        fontSize:17,
    },
    inputbox:{
        alignContent:'flex-start',
        borderColor:'#888888',
        borderWidth:1,
        marginVertical:10,
        marginHorizontal:20,
        padding:10,
        height:45,
        fontSize:15,
    },
    newacctouchable:{
        textAlign: 'center',
        color:'white',
        backgroundColor:'black',
        margin:10,
        marginHorizontal:20,
        padding:10,
        height:45,
        fontSize:17,
        alignContent:'center',
    },
   
});
