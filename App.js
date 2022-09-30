import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button} from 'react-native';
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
//Firebase Imports
import { auth } from './FirebaseApp';
import { signOut } from "firebase/auth";
// get the functions from the Firebase Auth library
import {  onAuthStateChanged } from "firebase/auth";

//Screen Imports
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import TabController from './screens/TabController';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  
  // ------------------------ State Variables -----------------------
  // state variable to track if there is a logged in user
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  
  // ------------------------ Lifecycle Hooks ---------------------------
  useEffect(()=>{
    // code to check if there is a logged in user
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log('Authenticated now!');
        setUserLoggedIn(true); //log the user 
      } else {
        setUserLoggedIn(false); //log out
      }
    });
  }, [])


  // ------------------------ View Template -----------------------
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Splash">
          <Stack.Screen
              name="Tab"
              component={TabController}
              options={({ navigation }) => ({
                headerStyle: {
                  backgroundColor: '#001C00',
                },
                headerTitleStyle: {
                  fontWeight: "bold"
                },
                headerBackVisible: false,
                headerLeft: ()=> null,
                headerRight: () => (
                  <Button
                    onPress={async() => {
                      try {
                        await signOut(auth)
                        console.log("User signed out")
                      }
                      catch (err) {
                        Alert.alert(`Signout failed, error occurred: ${err.message}`)
                      }
                      navigation.navigate("Login");
                    }
                    }
                    title="Sign out"
                    color="#C5F277"
                  />
                )
              })}
          />
          { 
          //User is not logged in - display Splash/Initial Screen
          !userLoggedIn &&
          <Stack.Screen name="Splash"
              options={{
                headerShown: false, // change this to `false`
              }}
              component={SplashScreen}
          /> 
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
              name="Expenses"
              component={ExpensesScreen}
          />    
       </Stack.Navigator>
    </NavigationContainer>
  );
}
