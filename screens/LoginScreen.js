import { useState,useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable} from 'react-native';
// Firebase imports
import {auth} from "../FirebaseApp";
// get the functions from the Firebase Auth library
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({navigation, route}) => {

    // ------- State Variables ---------------
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState("");
    const [movieSelectedByUser, setMovieSelectedByUser] = useState({});
   
    // ------------------------ Route Params -----------------------------

    // ------------------------ Lifecycle Hooks ---------------------------
    useEffect( () => {

        console.log("Login Screen Loaded")
        if(route.params) {
            console.log("Login Screen is supplied with the [selectedMovie] param in the route")
           
            // 1. Set the movieSelectedByUser with the [selectedMovie] param value from the route
            setMovieSelectedByUser(route.params.selectedMovie)
        } else{
            console.log("Login Screen is NOT supplied with the [selectedMovie] param in the route")
        }

    }, []);
   

    // ---------  Event listeners ------------
    const loginPressed = async() => {
        console.log(`Login Button Pressed!`)
        try {     
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log(`User is logged in. Username is: ${userCredential.user.email}`)
            console.log(Object.keys(movieSelectedByUser).length)

            // Conditional Navigation After Authenticating the User
            if(Object.keys(movieSelectedByUser).length === 0){
                
                console.log("Navigating to the MyPurchasesScreen")
                navigation.navigate("MyPurchases");
            } else if (Object.keys(movieSelectedByUser).length > 0) {

                console.log("Navigating to the MovieDetailScreen")
                navigation.navigate("MovieDetail", { selectedMovie: movieSelectedByUser })
            }
            
          } catch (err) {
            console.log(`Error when logging user ${err.message}`)
            setErrors(err.message) // displays errors to the UI
          }
    }

    const signupPressed = async() =>  {
        console.log(`Signup Button Pressed!`)
        try {
            // - send the values to Firebase Authentication
            // and wait for Firebase Auth to create a user with those credential
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log("Account creation success")
            console.log(userCredential)
            console.log(Object.keys(movieSelectedByUser).length)

            // Conditional Navigation After Authenticating the User
            if(Object.keys(movieSelectedByUser).length === 0){
                
                console.log("Navigating to the MyPurchasesScreen")
                navigation.navigate("MyPurchases");
            } else if (Object.keys(movieSelectedByUser).length > 0) {

                console.log("Navigating to the MovieDetailScreen")
                navigation.navigate("MovieDetail", { selectedMovie: movieSelectedByUser })
            }
            
        } catch (err) {
            console.log(`Error when creating user ${err.message}`)
            setErrors(err.message) // displays errors to the UI
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenHeading}>Login or Create an Account</Text>
            {/* Login Form */}
            <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Email: </Text>
                <TextInput 
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                /> 
                <Text style={styles.formLabel}>Password: </Text>
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
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={styles.signUpButton} onPress={signupPressed}>
                <Text style={styles.signUpText}>Create New Account</Text>
            </Pressable>
        </SafeAreaView>
      )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    screenHeading : {
        fontSize: 20,
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
        backgroundColor: "#3330e3",
        alignSelf:"stretch",
        padding:16,
        marginHorizontal:20,
        alignItems:"center",
        marginBottom:30,
        borderRadius:10,
    },
    buttonText : {
        color:"white",
        fontSize: 18,
        fontWeight: "bold"
    },  
    signUpButton : {
        alignSelf:"stretch",
        marginHorizontal:20,
        alignItems:"center",
        borderColor: "#3330e3",
        borderWidth: 1,
        padding: 16,
        borderRadius:10,
    },  
    signUpText : {
        color:"#3330e3",
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