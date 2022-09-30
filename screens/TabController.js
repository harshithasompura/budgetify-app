// Home Screen of our app - Tabs Go here!
import { StyleSheet, Text, SafeAreaView,  TextInput, View, Pressable} from 'react-native';
// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Screen Imports
import HomeScreen from './HomeScreen';
import ExpensesScreen from './ExpensesScreen';
// Vector Icons
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './SettingsScreen';
import CommunityScreen from './CommunityScreen';
const TabController = () => {
  const Tab = createBottomTabNavigator();

  return (
      
      <Tab.Navigator
        screenOptions={{
          "tabBarActiveBackgroundColor": "#001C00",
          "tabBarActiveTintColor": "#C5F277", 
          "tabBarInactiveTintColor": "gray",
         }} >
           <Tab.Screen component={HomeScreen} name="Home"
               options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home" color={color} size={size} />
                ),
                headerShown: false
              }}
           />
           <Tab.Screen name="Expenses" component={ExpensesScreen}
             options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="money" color={color} size={size} />
                ),
                headerShown: false
              }}
           />
            <Tab.Screen name="Community" component={CommunityScreen}
             options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="star" color={color} size={size} />
                ),
                headerShown: false
              }}
           />
            <Tab.Screen name="Settings" component={SettingsScreen}
             options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="gear" color={color} size={size} />
                ),
                headerShown: false
              }}
           />
        </Tab.Navigator>

    
  )
}

export default TabController