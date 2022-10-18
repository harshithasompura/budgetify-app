import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const SettingsScreen = ({ navigation, route }) => {
  const settingList = [
    {
      icon: "user-circle",
      text: "Edit Your Profile",
      screen: "Edit Your Profile",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.screen);
      }}
    >
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row" }}>
          <FontAwesome style={styles.profileIcon} name={item.icon} size={35} />
          <Text style={styles.settingText}> {item.text} </Text>
        </View>
        <FontAwesome name="angle-right" size={30} color="orangered" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={settingList} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#D6D6D6",
    borderBottomWidth: 1,
  },
  settingText: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    fontSize: 25,
    padding: 5,
  },
  profileIcon: {
    padding: 3,
  },
});

export default SettingsScreen;
