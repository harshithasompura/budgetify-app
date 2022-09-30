import { useState,useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable} from 'react-native';
// Importing fonts
import { useFonts,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  } from '@expo-google-fonts/ibm-plex-mono'
// Firebase imports
import {auth} from "../FirebaseApp";
// get the functions from the Firebase Auth library
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({navigation}) => {

    // ------- State Variables ---------------
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState("");
   
    // ------------------------ Route Params -----------------------------

    // ------------------------ Lifecycle Hooks ---------------------------
    useEffect( () => {
        console.log("Login Screen Loaded")
    }, []);
   

    // ---------  Event listeners ------------
    const loginPressed = async() => {
        console.log(`Login Button Pressed!`)
        try {     
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log(`User is logged in. Username is: ${userCredential.user.email}`)
            // Navigate to Register
            navigation.navigate("Tab");
          } catch (err) {
            console.log(`Error when logging user ${err.message}`)
            setErrors(err.message) // displays errors to the UI
          }
    }

    const signupPressed = async() =>  {
        console.log(`Signup Button Pressed!`)
        // Navigate to Register
        navigation.navigate("Register");
    }

    let [fontsLoaded] = useFonts({ IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold, IBMPlexMono_700Bold,})
    if (!fontsLoaded) {
        return <Text>Fonts are loading...</Text>
    } else {
    
    // ------------------------ View Template -----------------------

    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.screenHeading, {fontFamily:"IBMPlexMono_700Bold"}]}>Log in</Text>
            {/* Login Form */}
            <View style={[styles.formContainer]}>
                <Text style={[styles.formLabel, ,{fontFamily:"IBMPlexMono_600SemiBold"} ]}>Email: </Text>
                <TextInput 
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                /> 
                <Text style={[styles.formLabel,{fontFamily:"IBMPlexMono_600SemiBold"} ]}>Password: </Text>
                <TextInput 
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                /> 
            </View>   
            {/* Errors go here */}
            { errors ?  
                <View style={styles.errors}>
                    <Text style={styles.errorText}>{errors}</Text>
                </View>
            : null }
            <Pressable style={styles.loginButton} onPress={loginPressed}>
                <Text style={[styles.buttonText, {fontFamily:"IBMPlexMono_700Bold"}]}>Login</Text>
            </Pressable>
            <Pressable style={styles.signUpButton} onPress={signupPressed}>
                <Text style={[styles.signUpText, {fontFamily:"IBMPlexMono_700Bold"}]}>Don't have an account? Register.</Text>
            </Pressable>
        </SafeAreaView>
      )
    }
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
    }
});

export default LoginScreen