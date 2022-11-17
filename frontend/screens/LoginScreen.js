import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
} from "react-native";
// Firebase imports
import { auth } from "../FirebaseApp";
// get the functions from the Firebase Auth library
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  // ------- State Variables ---------------
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [errors, setErrors] = useState("");

  // ------------------------ Route Params -----------------------------

  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect(() => {
    console.log("Login Screen Loaded");
  }, []);

  //Form Validation
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
    }

    if (errorFlag) {
      console.log("errorFlag");
    } else {
      setLoading(false);
      setEmailErrorMsg("");
      setPasswordErrorMsg("");
      loginPressed();
    }
  };

  // ---------  Event listeners ------------
  const loginPressed = async () => {
    console.log(`Login Button Pressed!`);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(
        `User is logged in. Username is: ${userCredential.user.email}`
      );
      // Navigate to Register
      navigation.navigate("Tab");
    } catch (err) {
      console.log(`Error when logging user ${err.message}`);
      setErrors(err.message); // displays errors to the UI
    }
  };

  const signupPressed = async () => {
    console.log(`Signup Button Pressed!`);
    // Navigate to Register
    navigation.navigate("Register");
  };

  const forgotPassword = async () => {
    console.log(`Forgot Password Pressed!`);
    // Navigate to ForgotPassword
    navigation.navigate("ForgotPassword");
  };

  // ------------------------ View Template -----------------------

  return (
    <SafeAreaView style={[styles.container]}>
      <Text
        style={[styles.screenHeading, { fontFamily: "IBMPlexMono_700Bold" }]}
      >
        Log in
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
          style={[styles.formLabel, { fontFamily: "IBMPlexMono_600SemiBold" }]}
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

        <Pressable onPress={forgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
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
          Login
        </Text>
      </Pressable>
      <Pressable style={styles.signUpButton} onPress={signupPressed}>
        <Text
          style={[styles.signUpText, { fontFamily: "IBMPlexMono_700Bold" }]}
        >
          Don't have an account? Register.
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  forgotPassword: {
    alignSelf: "flex-end",
    fontSize: 14,
    fontWeight: "bold",
    color: "#B17BFF",
    marginBottom: 20,
  },
  textDanger: {
    color: "#dc3545",
  },
});

export default LoginScreen;
