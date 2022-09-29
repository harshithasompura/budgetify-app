import { useState, useEffect } from 'react';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
//Firebase Imports
import { auth } from './FirebaseApp';

// get the functions from the Firebase Auth library
import {  onAuthStateChanged } from "firebase/auth";

//Screen Imports
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';
import ExpensesScreen from './screens/ExpensesScreen';

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
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Splash">
          <Stack.Screen
              name="Home"
              component={HomeScreen}
          />
          { 
          //User is not logged in - display Splash/Initial Screen
          !userLoggedIn &&
          <Stack.Screen name="Splash"
              component={SplashScreen}
          /> 
          }
          <Stack.Screen
              name="Register"
              component={RegisterScreen}
          />
           <Stack.Screen
              name="Login"
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
