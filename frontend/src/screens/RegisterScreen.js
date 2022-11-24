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
import { db } from "../../FirebaseApp";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";
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
  // const [username, setUsername] = useState();
  const blankAvatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBGwlAahaapmmJ7Riv_L_ZujOcfWSUJnm71g&usqp=CAU`;

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
      // setUsername(() => {
      //   return email.split("@")[0];
      // });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Account creation success");
      console.log(userCredential);
      // - Add user to Firebase
      await setDoc(doc(db, "users", email.toLowerCase()), {
        name: email.split("@")[0],
        icon: blankAvatar,
      });
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
          opacity: 0.7,
          marginTop: 20,
        }}
      >
        💬 Budget your goals!
      </Text>
      <View style={styles.signupContainer}>
        <Text
          style={[styles.screenHeading, { fontFamily: "Montserrat_700Bold" }]}
        >
          Sign Up
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
            style={[styles.formLabel, { fontFamily: "Montserrat_600SemiBold" }]}
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
            style={[styles.formLabel, { fontFamily: "Montserrat_600SemiBold" }]}
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
            style={[styles.buttonText, { fontFamily: "Montserrat_700Bold" }]}
          >
            Register
          </Text>
        </Pressable>
        <Pressable style={styles.signUpButton} onPress={loginPressed}>
          <Text
            style={[styles.signUpText, { fontFamily: "Montserrat_700Bold" }]}
          >
            Already have an account?{" "}
            <Text style={{ textDecorationLine: "underline", color: "#B17BFF" }}>
              Login.
            </Text>
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
  signupContainer: {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 28,
    marginTop: 64,
    borderRadius: 20,
    alignItems: "center",
  },
  screenHeading: {
    fontSize: 24,
    marginBottom: 40,
    marginTop: 10,
  },
  formContainer: {
    alignSelf: "stretch",
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
  },
  signUpText: {
    color: "#001C00",
    fontSize: 15,
    marginTop: 20,
    marginBottom: 12,
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
