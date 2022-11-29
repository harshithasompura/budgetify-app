import { useState, useEffect } from "react";
import { LogBox } from "react-native";
// Navigation imports
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button } from "react-native";
// Importing fonts
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";
//Firebase Imports
import { auth } from "./FirebaseApp";
import { signOut } from "firebase/auth";
// get the functions from the Firebase Auth library
import { onAuthStateChanged } from "firebase/auth";

//Screen Imports
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ExpensesScreen from "./src/screens/ExpensesScreen";
import TabController from "./src/screens/TabController";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";

// Redux
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/redux/store";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // ------------------------ State Variables -----------------------
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect(() => {
    // code to check if there is a logged in user
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authenticated now!");
        setUserLoggedIn(true); //log the user
      } else {
        setUserLoggedIn(false); //log out
      }
    });
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return;
  } else {
    LogBox.ignoreLogs([
      "AsyncStorage has been extracted from react-native core",
    ]);
    // ------------------------ View Template -----------------------
    return (
      <ReduxProvider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {
              //User is not logged in - display Login Screen
              !userLoggedIn && (
                <Stack.Screen
                  name="Login"
                  options={{
                    headerShown: false, // change this to `false`
                  }}
                  component={LoginScreen}
                />
              )
            }
            <Stack.Screen
              name="Tab"
              component={TabController}
              options={({ navigation }) => ({
                title: "",
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerBackVisible: false,
                headerShadowVisible: false,
                headerLeft: () => null,
                headerRight: () => (
                  <Button
                    onPress={async () => {
                      try {
                        await signOut(auth);
                        console.log("User signed out");

                        //reset the navigation state after logged out
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                          })
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    title="Sign out"
                    color="#B17BFF"
                  />
                ),
              })}
            />
            <Stack.Screen
              options={{
                headerShown: false, // change this to `false`
              }}
              name="Register"
              component={RegisterScreen}
            />
            <Stack.Screen
              name="ForgotPassword"
              options={{
                headerTintColor: "#fff",
                headerTitle: "",
                headerShadowVisible: false, // applied here
                headerStyle: {
                  backgroundColor: "#62D2B3",
                },
              }}
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="Expenses" component={ExpensesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ReduxProvider>
    );
  }
}
