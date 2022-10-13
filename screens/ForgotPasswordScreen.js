import {Text, TextInput, StyleSheet, Pressable, View} from 'react-native';
import { useState } from 'react';

// Firebase imports
import {auth} from "../FirebaseApp";
import { sendPasswordResetEmail } from "firebase/auth"
// get the functions from the Firebase Auth library
//import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState("");

  const doUserPasswordReset = async() => {
    console.log(`Reset Button Pressed!`);
    try {     
        const userCredential = await sendPasswordResetEmail(auth, email)
        
        alert("Password reset email sent");
        // Navigate to Register
        navigation.navigate("Login");
    } catch (err) {
        console.log(`Error when sending reset password email :  ${err.message}`)
        setErrors(err.message) // displays errors to the UI
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>{'Please enter your account email to reset your password:'}</Text>
        <TextInput
          style={styles.inputStyle}
          value={email}
          placeholder={'Your account email'}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
        />
        <Pressable onPress={() => doUserPasswordReset()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{'Request Password Reset'}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
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
    button : {
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

export default ForgotPasswordScreen;