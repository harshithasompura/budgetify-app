// Home Screen of our app - Tabs Go here!
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
} from "react-native";
// Navigation imports
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Screen Imports
import HomeScreen from "./HomeScreen";
import ExpensesScreen from "./ExpensesScreen";
import InputExpensesScreen from "./InputExpensesScreen";
import SettingsScreen from "./SettingsScreen";
import CommunityScreen from "./CommunityScreen";
import EditProfileScreen from "./EditProfileScreen";
import ChatScreen from "./ChatScreen";
import ChatsListScreen from "./ChatsListScreen";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./components/Camera";
import ManageCategoriesScreen from "./ManageCategoriesScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import ManageCurrenciesScreen from "./ManageCurrenciesScreen";
import NotificationScreen from "./NotificationScreen";

// create stack navigators for each tab
// each tab has its own stack
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ExpensesStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();

// define screens included in the stack for Settings Tab
const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        options={{
          headerShown: false,
        }}
        name="Your Settings"
        component={SettingsScreen}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        name="Edit Your Profile"
        component={EditProfileScreen}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        options={{
          headerTintColor: "#B17BFF",
          headerTitle: "",
          headerShadowVisible: false, // applied here
          headerStyle: {
            backgroundColor: "#F2F3F4",
          },
        }}
        name="ChangePassword"
        component={ChangePasswordScreen}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        options={{
          headerTintColor: "#B17BFF",
          headerTitle: "",
          headerShadowVisible: false, // applied here
          headerStyle: {
            backgroundColor: "#F2F3F4",
          },
        }}
        name="ManageCategories"
        component={ManageCategoriesScreen}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        options={{
          headerTintColor: "#B17BFF",
          headerTitle: "",
          headerShadowVisible: false, // applied here
          headerStyle: {
            backgroundColor: "#F2F3F4",
          },
        }}
        name="ManageCurrencies"
        component={ManageCurrenciesScreen}
      ></SettingsStack.Screen>
      <SettingsStack.Screen
        options={{
          headerTintColor: "#B17BFF",
          headerTitle: "",
          headerShadowVisible: false, // applied here
          headerStyle: {
            backgroundColor: "#F2F3F4",
          },
        }}
        name="Notifications"
        component={NotificationScreen}
      ></SettingsStack.Screen>
      {/* add those screens that should be navigated inside Setting Tab in here */}
    </SettingsStack.Navigator>
  );
};

const ExpensesStackScreen = () => {
  return (
    <ExpensesStack.Navigator>
      <ExpensesStack.Screen
        options={{
          headerShown: false,
        }}
        name="Expenses Screen"
        component={ExpensesScreen}
      ></ExpensesStack.Screen>
      {/* add those screens that should be navigated inside Expenses Tab in here */}
      <ExpensesStack.Group screenOptions={{ presentation: "modal" }}>
        <ExpensesStack.Screen name="Camera" component={CameraScreen} />
        <ExpensesStack.Screen
          options={{
            headerTitle: "",
            headerStyle: { backgroundColor: "rgba(219, 219, 219,0.9)" },
          }}
          name="Add Expense"
          component={InputExpensesScreen}
        />
      </ExpensesStack.Group>
    </ExpensesStack.Navigator>
  );
};

const HomeStackScreen = () => {
  // return (
  // );
};

const CommunityStackScreen = () => {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen
        options={{
          headerShown: false,
        }}
        name="CommunityScreen"
        component={CommunityScreen}
      ></CommunityStack.Screen>

      <CommunityStack.Screen
        options={{
          headerShown: false,
        }}
        name="Chats List"
        component={ChatsListScreen}
      ></CommunityStack.Screen>

      <CommunityStack.Screen
        options={{
          headerShown: false,
        }}
        name="Chat Room"
        component={ChatScreen}
      ></CommunityStack.Screen>
    </CommunityStack.Navigator>
  );
};

const TabController = () => {
  const Tab = createBottomTabNavigator();

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    return (routeName === 'Chats List' || 
            routeName === 'Chat Room') ? 'none' : 'flex';
  };
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "#001C00",
        tabBarActiveTintColor: "#C5F277",
        tabBarInactiveTintColor: "gray",
      }}
    >
      {/* <Tab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      /> */}
      <Tab.Screen
        name="Expenses"
        component={ExpensesStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackScreen}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabController;
