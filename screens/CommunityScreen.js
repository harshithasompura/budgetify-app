import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import Post from "./components/Post.js";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { db } from "../FirebaseApp";
import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";

const CommunityScreen = ({ navigation, route }) => {
  // State Variables
  const [isOpen, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = ["40%"];
  const [postsList, setPostsList] = useState([]);

  const renderItem = ({item}) => {
    const date = new Date(item.createdAt);
    const minutes =  date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " " +
    date.getHours() + ":" + date.getMinutes();
    return(
      <View style={[styles.postContainer, {fontFamily:"IBMPlexMono_500Medium"}]}>
          <View style={styles.postHeader}>
            {/* Post header */}
            <Image style={styles.userAvatar} source={{ url: item.userPhoto }} />
            <View>
              <Text style={[{fontFamily:"IBMPlexMono_500Medium"}]}>@{item.username}</Text>
              <Text>{minutes}</Text>
            </View>
          </View>
           <Text style={[{fontFamily:"IBMPlexMono_400Regular", fontSize:18}]}> {item.comment} </Text>
      </View>
    );
  }

  useEffect(() => {
    const postQuery = query(collection(db, "post"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(postQuery, (querySnapshot) => {
      const postsFromFirebase = querySnapshot.docs.map((doc) => ({
        comment: doc.data().comment,
        username: doc.data().username,
        userPhoto: doc.data().userAvatar,
        createdAt: Date((doc.data().createdAt.seconds)),
        // name: doc.data().name,
        // isGroup: doc.data().isGroup,
        
      }));
      setPostsList(postsFromFirebase);
    });
    return () => {
      unsubscribePosts();
    }
  }, []);

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
      <View style={styles.postFeed}>
        {/* Post feed should go here */}
        <FlatList data={postsList} renderItem={renderItem} />
      </View>
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
            <Post
              postResult={(data) => {
                if (data === true) {
                  setOpen(false);
                }
              }}
            />
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
    flex: 2,
  },
  postContainer :{
    borderRadius:8,
    borderWidth:1,
    marginHorizontal:20,
    marginVertical:8,
    padding:20,
  },
  postHeader:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:10,
  },
  userAvatar: {
    height: 60,
    width: 60,
    backgroundColor:"pink",
  },
});

export default CommunityScreen;
