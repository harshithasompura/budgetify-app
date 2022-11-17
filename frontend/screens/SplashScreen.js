// Initial Screen of our app
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
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
const SplashScreen = ({ navigation }) => {
  // ------------------------ Event Handlers -----------------------
  const loginPressed = () => {
    console.log(`Login Button Pressed!`);
    // Navigate to Login
    navigation.navigate("Login");
  };

  const registerPressed = () => {
    console.log(`Register Button Pressed!`);
    // Navigate to Register
    navigation.navigate("Register");
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
      <SafeAreaView style={styles.container}>
        <Image source={require(`../assets/budget-image.png`)} />
        <Text style={[styles.appHeader, { fontFamily: "IBMPlexMono_700Bold" }]}>
          Budget your goals!
        </Text>
        {/* Login Button */}
        <Pressable
          style={[
            styles.loginButton,
            { backgroundColor: "#C5F277", marginTop: 30 },
          ]}
          onPress={loginPressed}
        >
          <Text
            style={[styles.buttonText, { fontFamily: "IBMPlexMono_700Bold" }]}
          >
            Log In
          </Text>
        </Pressable>
        {/* Register Button */}
        <Pressable
          style={[styles.loginButton, { marginTop: 10, marginHorizontal: 40 }]}
          onPress={registerPressed}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontFamily: "IBMPlexMono_700Bold",
                color: "#C5F277",
                borderColor: "#C5F277",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 20,
                width: "100%",
                textAlign: "center",
              },
            ]}
          >
            Create an Account
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }
};
// ------------------------ Styles -----------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#001C00",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appHeader: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 20,
  },
  loginButton: {
    alignSelf: "stretch",
    padding: 16,
    marginHorizontal: 50,
    alignItems: "center",
    borderRadius: 10,
  },
});
export default SplashScreen;
