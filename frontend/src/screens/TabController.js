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
import ExpensesDetailScreen from "./ExpensesDetailScreen";
import SettingsScreen from "./SettingsScreen";
import CommunityScreen from "./CommunityScreen";
import EditProfileScreen from "./EditProfileScreen";
import ChatScreen from "./ChatScreen";
import ChatsListScreen from "./ChatsListScreen";
import EditExpensesScreen from "./EditExpensesScreen";
import PostDetailScreen from "./PostDetailScreen";

// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../components/Camera";
import ManageCategoriesScreen from "./ManageCategoriesScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import TermsAndConditionsScreen from "./TermsAndConditionsScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";

// create stack navigators for each tab
// each tab has its own stack
const SettingsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ExpensesStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();

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
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
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
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
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
        <ExpensesStack.Screen
            options={{
              headerTitle: "",
              headerStyle: { backgroundColor: "rgba(219, 219, 219,0.9)" },
            }}
            name="Add Expense"
            component={InputExpensesScreen}
          />
      </ExpensesStack.Group>
      <ExpensesStack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerShown: false,
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#001c00",
        }}
        name="Expense Detail"
        component={ExpensesDetailScreen}
      />
      <ExpensesStack.Screen
        name="Camera"
        options={{
          headerShown: false,
        }}
        component={CameraScreen}
      />
      <ExpensesStack.Screen
        name="Edit Expenses"
        options={{
          headerShown: false,
        }}
        component={EditExpensesScreen}
      />
    </ExpensesStack.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home Analytics"
        options={{
          headerShown: false,
        }}
        component={HomeScreen}
      />
    </HomeStack.Navigator>
  );
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
        name="Post Detail"
        component={PostDetailScreen}
      ></CommunityStack.Screen>

    </CommunityStack.Navigator>
  );
};

const MessagesStackScreen = () => {
  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen
        options={{
          headerShown: false,
        }}
        name="Chats List"
        component={ChatsListScreen}
      ></MessagesStack.Screen>

      <MessagesStack.Screen
        options={{
          headerShown: false,
        }}
        name="Chat Room"
        component={ChatScreen}
      ></MessagesStack.Screen>
    </MessagesStack.Navigator>
  );
}

const TabController = () => {
  const Tab = createBottomTabNavigator();

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    return routeName === "Chats List" || 
           routeName === "Chat Room" ||
           routeName === "Camera" ||
           routeName === "Edit Expenses" ||
           routeName === "Add Expense"
          //  routeName === "Post Detail"
      ? "none"
      : "flex";
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#62D2B3",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        component={HomeStackScreen}
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesStackScreen}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          headerShown: false,
        })}
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
        name="Messages"
        component={MessagesStackScreen}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="commenting-o" color={color} size={size} />
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