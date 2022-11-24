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
import { auth } from "../../FirebaseApp";
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
    <SafeAreaView
      style={[styles.container, { fontFamily: "Montserrat_400Regular" }]}
    >
      {/* Title */}
      <Text
        style={{
          fontFamily: "Montserrat_600SemiBold",
          fontSize: 18,
          opacity: 0.8,
        }}
      >
        👋 Welcome to Budgetify!
      </Text>
      <View style={styles.loginContainer}>
        <Text
          style={[styles.screenHeading, { fontFamily: "Montserrat_700Bold" }]}
        >
          Log in
        </Text>
        {/* Login Form */}
        <View style={[styles.formContainer]}>
          <Text
            style={[
              styles.formLabel,
              ,
              { fontFamily: "Montserrat_600SemiBold" },
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
              { fontFamily: "Montserrat_600SemiBold", marginTop: 6 },
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

          <Pressable onPress={forgotPassword}>
            <Text
              style={[
                styles.forgotPassword,
                { fontFamily: "Montserrat_600SemiBold" },
              ]}
            >
              Forgot Password?
            </Text>
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
            style={[styles.buttonText, { fontFamily: "Montserrat_700Bold" }]}
          >
            Login
          </Text>
        </Pressable>
        <Pressable style={styles.signUpButton} onPress={signupPressed}>
          <Text
            style={[styles.signUpText, { fontFamily: "Montserrat_700Bold" }]}
          >
            Don't have an account?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Register.</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#62D2B3",
  },
  loginContainer: {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 28,
    marginTop: 88,
    borderRadius: 20,
    alignItems: "center",
  },
  screenHeading: {
    fontSize: 24,
    marginBottom: 40,
    marginTop: 10,
    fontWeight: "400",
  },
  formContainer: {
    alignSelf: "stretch",
    paddingHorizontal: 4,
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
    backgroundColor: "#C5F277",
    alignSelf: "stretch",
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#001c00",
    fontSize: 18,
  },
  signUpButton: {
    alignSelf: "stretch",
    marginHorizontal: 10,
    alignItems: "center",
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  signUpText: {
    color: "#001C00",
    fontSize: 15,
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
    fontSize: 15,
    textDecorationLine: "underline",
    color: "#B17BFF",
    marginBottom: 20,
    marginTop: 4,
  },
  textDanger: {
    color: "#dc3545",
  },
});

export default LoginScreen;
