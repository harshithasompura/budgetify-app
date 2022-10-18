import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
} from "react-native";
// Importing fonts
import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";
// Firebase imports
import { auth } from "../FirebaseApp";
// get the functions from the Firebase Auth library
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  // ------- State Variables ---------------
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
  const [errors, setErrors] = useState("");

  // ------------------------ Route Params -----------------------------
  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect(() => {
    console.log("Register Screen Loaded");
  }, []);

  /**
   * authenticate user
   */
  const formValidation = async () => {
    setLoading(true);
    let errorFlag = false;

    // input validation
    if (email.length == 0) {
      errorFlag = true;
      setEmailErrorMsg("Email is required feild");
    }

    if (password.length == 0) {
      errorFlag = true;
      setPasswordErrorMsg("Password is required feild");
    } else if (password.length < 8 || password.length > 20) {
      errorFlag = true;
      setPasswordErrorMsg("Password should be min 8 char and max 20 char");
    } else if (password !== confirmPassword) {
      errorFlag = true;
      setPasswordErrorMsg("Passwoad and confirm password should be same.");
    }

    if (confirmPassword.length == 0) {
      errorFlag = true;
      setConfirmPasswordErrorMsg("Confirm Password is required feild");
    } else if (confirmPassword.length < 8 || confirmPassword.length > 20) {
      errorFlag = true;
      setConfirmPasswordErrorMsg(
        "Password should be min 8 char and max 20 char"
      );
    } else if (password !== confirmPassword) {
      errorFlag = true;
      setConfirmPasswordErrorMsg(
        "Passwoad and confirm password should be same."
      );
    }

    if (errorFlag) {
      console.log("errorFlag");
    } else {
      setLoading(false);
      setEmailErrorMsg("");
      setPasswordErrorMsg("");
      setConfirmPasswordErrorMsg("");
      signupPressed();
    }
  };

  // ---------  Event listeners ------------
  const signupPressed = async () => {
    console.log(`Register Button Pressed!`);
    try {
      // - send the values to Firebase Authentication
      // and wait for Firebase Auth to create a user with those credential
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account creation success");
      console.log(userCredential);
      // - Navigate to home
      navigation.navigate("Tab");
    } catch (err) {
      console.log(`Error when creating user ${err.message}`);
      setErrors(err.message); // displays errors to the UI
    }
  };
  const loginPressed = async () => {
    console.log(`Login Button Pressed!`);
    // Navigate to Login
    navigation.navigate("Login");
  };
  let [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  });
  if (!fontsLoaded) {
    return <Text>Fonts are loading...</Text>;
  } else {
    // ------------------------ View Template -----------------------
    return (
      <SafeAreaView style={[styles.container]}>
        <Text
          style={[styles.screenHeading, { fontFamily: "IBMPlexMono_700Bold" }]}
        >
          Sign Up
        </Text>
        {/* Login Form */}
        <View style={[styles.formContainer]}>
          <Text
            style={[
              styles.formLabel,
              ,
              { fontFamily: "IBMPlexMono_600SemiBold" },
            ]}
          >
            Email{" "}
          </Text>
          <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />
          {emailErrorMsg.length > 0 && (
            <Text style={styles.textDanger}>{emailErrorMsg}</Text>
          )}
          <Text
            style={[
              styles.formLabel,
              { fontFamily: "IBMPlexMono_600SemiBold" },
            ]}
          >
            Password{" "}
          </Text>
          <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
          />
          {passwordErrorMsg.length > 0 && (
            <Text style={styles.textDanger}>{passwordErrorMsg}</Text>
          )}
          <Text
            style={[
              styles.formLabel,
              { fontFamily: "IBMPlexMono_600SemiBold" },
            ]}
          >
            Confirm Password{" "}
          </Text>
          <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPasswordErrorMsg.length > 0 && (
            <Text style={styles.textDanger}>{confirmPasswordErrorMsg}</Text>
          )}
        </View>
        {/* Errors go here */}
        {errors ? (
          <View style={styles.errors}>
            <Text style={styles.errorText}>{errors}</Text>
          </View>
        ) : null}
        <Pressable style={styles.loginButton} onPress={formValidation}>
          <Text
            style={[styles.buttonText, { fontFamily: "IBMPlexMono_700Bold" }]}
          >
            Register
          </Text>
        </Pressable>
        <Pressable style={styles.signUpButton} onPress={loginPressed}>
          <Text
            style={[styles.signUpText, { fontFamily: "IBMPlexMono_700Bold" }]}
          >
            Already have an account? Login.
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C5F277",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenHeading: {
    fontSize: 30,
    fontWeight: "400",
  },
  formContainer: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  formLabel: {
    fontWeight: "bold",
  },
  inputStyle: {
    marginVertical: 15,
    height: 48,
    padding: 15,
    borderColor: "#888",
    borderRadius: 10,
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: "#001C00",
    alignSelf: "stretch",
    padding: 16,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#C5F277",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    alignSelf: "stretch",
    marginHorizontal: 10,
    alignItems: "center",
    padding: 16,
  },
  signUpText: {
    color: "#001C00",
    fontSize: 18,
    fontWeight: "bold",
  },
  errors: {
    alignSelf: "stretch",
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: "#C63461",
    marginBottom: 20,
  },
  errorText: {
    color: "white",
  },
  textDanger: {
    color: "#dc3545",
  },
});

export default RegisterScreen;
