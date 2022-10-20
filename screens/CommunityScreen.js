import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import Post from "./components/Post.js";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const CommunityScreen = ({ navigation, route }) => {
  // State Variables
  const [isOpen, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = ["40%"];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isOpen ? "rgba(0,0,0,.6)" : "white" },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
        }}
      >
        {/* Header: Title + Chat button/icon */}
        <Text
          style={[styles.screenHeading, { fontFamily: "IBMPlexMono_700Bold" }]}
        >
          Community
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Chats List");
          }}
        >
          <Ionicons style={styles.icon} name="chatbox-ellipses" size={35} />
        </TouchableOpacity>
      </View>
      <View style={styles.postFeed}>{/* Post feed should go here */}</View>
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
  screenHeading: {
    fontSize: 30,
    fontWeight: "400",
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
  postFeed: {
    flex: 1,
  },
});

export default CommunityScreen;
