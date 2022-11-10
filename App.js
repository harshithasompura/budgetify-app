import { useState, useEffect } from "react";
// Navigation imports
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button } from "react-native";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";
//Firebase Imports
import { auth } from "./FirebaseApp";
import { signOut } from "firebase/auth";
// get the functions from the Firebase Auth library
import { onAuthStateChanged } from "firebase/auth";

//Screen Imports
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./screens/SplashScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import TabController from "./screens/TabController";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Push notifs imports
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function App() {
  // ------------------------ State Variables -----------------------
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect(() => {
    // Push notifs
    registerForPushNotification().then(token=>console.log(token));

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

  // Helpers/methods
  async function registerForPushNotification(){
    const {status} = await  Notifications.getPermissionsAsync();
    if (status != 'granted') {
      const { status } = await  Notifications.getPermissionsAsync();
      // finalStatus = status;
    }
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token
  }

  // ------------------------ View Template -----------------------
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Tab"
          component={TabController}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "#001C00",
            },
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackVisible: false,
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
                color="#C5F277"
              />
            ),
          })}
        />
        {
          //User is not logged in - display Splash/Initial Screen
          !userLoggedIn && (
            <Stack.Screen
              name="Splash"
              options={{
                headerShown: false, // change this to `false`
              }}
              component={SplashScreen}
            />
          )
        }
        <Stack.Screen
          options={{
            headerShown: false, // change this to `false`
          }}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false, // change this to `false`
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{
            headerTintColor: "#B17BFF",
            headerTitle: "",
            headerShadowVisible: false, // applied here
            headerStyle: {
              backgroundColor: "#F2F3F4",
            },
          }}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
