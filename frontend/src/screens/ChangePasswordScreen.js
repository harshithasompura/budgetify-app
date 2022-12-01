import { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
  Alert,
} from "react-native";
// Firebase imports
import { auth } from "../../FirebaseApp";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { async } from "@firebase/util";

const ChangePasswordScreen = () => {
  // State Variables
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewpassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState("");

  // event listeners
  const reauthenticateUser = async(currentPassword) => {
    console.log("Password updated!");
    var user = auth.currentUser;
    console.log(user.email)
    var cred = EmailAuthProvider.credential(
        user.email, currentPassword);
    const result = await reauthenticateWithCredential(
          auth.currentUser, 
          cred
    )    
    return result;
  }

  const changePassword = (currentPassword, newPassword) => {
      setErrors("");
      reauthenticateUser(currentPassword).then(() => {
      var user = auth.currentUser;
      updatePassword(user, newPassword).then(() => {
        setErrors("");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        Alert.alert("Updated Password successfully!");
      }).catch((error) => { console.log(error); setErrors(error.message) });
    }).catch((error) => { console.log(error); setErrors(error.message) });
  }

  const formValidation = () => {
    console.log("Change Password Button pressed!");

    if(password === "" || newPassword === "" || confirmNewpassword === ""){
      setErrors("Please enter all the fields!");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      return;
    }

    // Check if current password matches the signed-in user
    changePassword(password, newPassword);
  }

  // View Template
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{marginBottom:20, fontSize:18, fontFamily: "Montserrat_600SemiBold"}}>Change Password </Text>
      <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Enter Current Password"
            value={password}
            onChangeText={setPassword}
      />
       <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
      />
       <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Re-enter New Password"
            value={confirmNewpassword}
            onChangeText={setConfirmNewPassword}
      />
       {errors ? (
          <View style={styles.errors}>
            <Text style={styles.errorText}>{errors}</Text>
          </View>
        ) : null}
        <Pressable style={styles.loginButton} onPress={formValidation}>
          <Text
            style={[styles.buttonText, { fontFamily: "Montserrat_700Bold" }]}
          >
            Change Password
          </Text>
        </Pressable>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({ 
  container: {
    backgroundColor: "#fff",
    flex:1,
    alignItems: "center",
  },
  inputStyle: {
    marginVertical: 15,
    height: 48,
    width:"90%",
    marginHorizontal:40,
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
    marginHorizontal:20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#001c00",
    fontSize: 16,
  },
  errors: {
    alignSelf: "stretch",
    padding: 14,
    marginHorizontal: 20,
    backgroundColor: "#C63461",
    marginBottom: 20,
    borderRadius:12,
  },
  errorText: {
    color: "white",
  },
});