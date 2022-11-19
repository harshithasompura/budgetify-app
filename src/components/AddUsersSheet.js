import { useState, useEffect, useRef } from "react";
import { db } from "../../FirebaseApp";
import { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const blankAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AddUsersSheet = (props) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userList, setUserList] = useState([]);
  const [uid] = useState(props.uid);

  useEffect(() => {
    const userQuery = query(
      collection(db, "users"),
      where("__name__", "!=", uid),
      orderBy("__name__")
    );

    const unsubscribeUsers = onSnapshot(userQuery, (querySnapshot) => {
      const usersFromFB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        icon: doc.data().icon,
        name: doc.data().name,
      }));
      setUserList(usersFromFB);
    });

    return unsubscribeUsers;
  }, []);

  useEffect(() => {
    if (searchTxt === "") {
      setSearchResults(userList);
    } else {
      const results = userList.filter((user) =>
        user.id.toLowerCase().includes(searchTxt.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTxt, userList]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        let collectionId = item.id;
        let collectionName = item.isGroup ? "group-chats" : "private-chats";
        if (!item.isGroup) {
          const uid1 = uid;
          const uid2 = item.id;
          collectionId = uid1 < uid2 ? uid1 + "&" + uid2 : uid2 + "&" + uid1;
        }
        props.navigation.navigate("Chat Room", {
          collectionId: collectionId,
          collectionName: collectionName,
          objectIcon: item.icon,
          objectName: item.name,
          fromWhere: "usersList",
        });
      }}
    >
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row" }}>
          {item.icon !== "" && (
            <Image style={[styles.avatar]} source={{ url: item.icon }} />
          )}
          {item.icon === "" && (
            <Image style={[styles.avatar]} source={{ url: blankAvatarUrl }} />
          )}
          <Text style={styles.text}> {item.name} </Text>
        </View>
        <FontAwesome name="angle-right" size={30} color="black" />
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheetView>
      <Text style={styles.bsTitle}>New message</Text>
      <View style={styles.bsSearchBarContainer}>
        <BottomSheetTextInput
          style={styles.bsSearchBar}
          placeholder="Type a name"
          placeholderTextColor="#C5F277"
          onChangeText={setSearchTxt}
          color="#C5F277"
        />
        <Pressable style={styles.bsSearchBtn}>
          <Ionicons name="search" size={25} color="black" />
        </Pressable>
      </View>
      <FlatList data={searchResults} renderItem={renderItem} />
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  bsTitle: {
    // backgroundColor: 'green',
    fontSize: 30,
    padding: 2,
    marginLeft: 18,
    fontWeight: "bold",
  },
  bsSearchBar: {
    flex: 0.87,
    paddingLeft: 15,
    backgroundColor: "black",
    // width: '
    // marginRight: 10
    borderRadius: 50,
  },
  bsSearchBtn: {
    // padding: 10,
    // paddingLeft: 0,
    // flex: 0.1,
    backgroundColor: "#C5F277",
    position: "absolute",
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  bsSearchBarContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    margin: 10,
    height: 40,
    position: "relative",
    borderRadius: 50,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#D6D6D6",
    borderBottomWidth: 1,
    height: 75,
  },
  text: {
    // fontFamily: 'IBM Plex Mono',
    fontSize: 25,
    padding: 15,
    paddingLeft: 5,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 40,
  },
  backArrow: {
    // backgroundColor: 'green',
    width: 40,
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    // backgroundColor: 'green',
    fontSize: 32,
    // padding: 15,
    marginLeft: 18,
    fontWeight: "bold",
  },
});

export default AddUsersSheet;
