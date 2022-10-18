import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import Post from "./components/Post.js";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const CommunityScreen = ({ navigation, route }) => {
  // State Variables
  const [isOpen, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = ["40%"];
  const optionList = [
    { icon: "chatbox-ellipses", text: "Group Chat", screen: "Group Chat" },
    // {icon: 'chatbubbles-sharp', text: 'Forum', screen: 'ForumScreen'}
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.screen);
      }}
    >
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons style={styles.icon} name={item.icon} size={35} />
          <Text style={styles.text}> {item.text} </Text>
        </View>
        <FontAwesome name="angle-right" size={30} color="orangered" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isOpen ? "rgba(0,0,0,.6)" : "white" },
      ]}
    >
      <FlatList data={optionList} renderItem={renderItem} />
      {/* Add post button */}
      <TouchableOpacity
        style={styles.plusIcon}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Icon name="plus" color={"#C5F277"} size={20} />
      </TouchableOpacity>
      {/* Bottom Sheet */}
      {isOpen ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setOpen(false)}
        >
          <BottomSheetView>
            <Post />
          </BottomSheetView>
        </BottomSheet>
      ) : null}
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
  text: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    fontSize: 25,
    padding: 5,
  },
  icon: {
    padding: 3,
  },
  plusIcon: {
    backgroundColor: "#001c00",
    width: 50,
    height: 50,
    marginHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    alignSelf: "flex-end",
  },
});

export default CommunityScreen;
