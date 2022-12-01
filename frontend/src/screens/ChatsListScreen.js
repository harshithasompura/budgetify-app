import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import AddUsersSheet from "../components/AddUsersSheet";
import { useState, useEffect, useRef, useCallback } from "react";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { db } from "../../FirebaseApp";
import { auth } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  collectionGroup,
  getDocs
} from "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";
import { FloatingAction } from "react-native-floating-action";
import Icon from "react-native-vector-icons/FontAwesome";

const blankAvatarUrl = "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";

const ChatsListScreen = ({ navigation }) => {
  const snapPoints = ["75%"];
  const sheetRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [chatsList, setChatsList] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [uid, setUid] = useState();

  const didMount = useRef(false);
  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.email);
      } else {
        console.log("no signed-in user");
      }
    });

    return unsubscribeOnAuth;
  }, []);

  // called when uid's stage changed
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const chatsQuery = query(
      collection(db, "private-chats"),
      where("members", "array-contains", uid)
    );

    //get related chatrooms and create listener for the chat list
    const unsubscribeChats = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsPromises = querySnapshot.docs.map(async (document) => {
        for (const member of document.data().members) {
          if (uid !== member) {
            const docRef = doc(db, "users", member);
            const docSnap = await getDoc(docRef);
            // console.log(document.id);

            const msgDate = document.data()
                                    .latestMsg
                                    .createdAt
                                    .toDate();
            const hours =  msgDate.getHours().length === 1 ?
                           "0" + msgDate.getHours() :
                           msgDate.getHours()
            const minutes =  msgDate.getMinutes().length === 1 ?
                             "0" + msgDate.getMinutes() :
                             msgDate.getMinutes()
            const createdAt = hours + ":" + minutes;

            return {
              id: document.id,
              name: docSnap.data().name,
              icon: docSnap.data().icon,
              latestMsg: {
                text: document.data().latestMsg.text,
                createdAt: createdAt
              }
            };
          }
        }
      });

      //wait until all promises resolved
      const chatsFromFB = await Promise.all(chatsPromises);
      setChatsList(chatsFromFB);
    });

    return () => {
      unsubscribeChats();
    } 
  }, [uid]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.75}
      />
    ),
    []
  );

  const actions = [
    {
      icon: <Icon name="plus" color={"black"} size={30} style={{height: 28}} />,
      name: "Post"
    }
  ];

  const renderItem = ({ item, index, separator }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{borderRadius: 20,}}
      onPress={() => {
        let collectionId = item.id;
        let collectionName = "private-chats";
        navigation.navigate("Chat Room", {
          collectionId: collectionId,
          collectionName: collectionName,
          objectIcon: item.icon,
          objectName: item.name,
        });
      }}
    >
      <View style={styles.listItem}>
        <View style={{ flexDirection: "row" }}>
          <Image style={styles.avatar} 
                 source={{ 
                  url: item.icon === "" ? 
                  blankAvatarUrl : 
                  item.icon}
                 } 
          />
          <View style={{justifyContent: 'center', flex: 1 }}>
            <Text style={[styles.text, { marginTop: 10, color: 'black'}]}>{item.name}</Text>
            <Text
              numberOfLines={1}
              style={[styles.text, {fontSize: 15,  marginBottom: 0, width: 220}]}
            >{item.latestMsg.text}
            </Text>
          </View>
          <Text style={{ color: 'grey', alignSelf: 'center', textAlign: 'right', marginRight: 20}}>
          {item.latestMsg.createdAt}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "row", position: "relative", marginTop: 22 }}>
        <Text style={styles.title}>Messages</Text>

        <Pressable style={styles.addUserBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={35} color="black" />
        </Pressable>
      </View>

      <View style={styles.bsSearchBarContainer}>
        <TextInput
          style={styles.bsSearchBar}
          placeholder="Type a name"
          onChangeText={setSearchTxt}
          color="black"
        />
        <Pressable style={styles.bsSearchBtn}>
          <Ionicons name="search" size={25} color="black" />
        </Pressable>
      </View>

        <FlatList 
          data={chatsList} 
          renderItem={renderItem}
          style={styles.chatsList}
          ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: 'grey', marginLeft: 70, marginRight: 20, opacity: 0.3}} />}
        />

      {isOpen ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setOpen(false)}
          backdropComponent={renderBackdrop}
          backgroundStyle={{backgroundColor: '#62D3B4'}}
        >
          <AddUsersSheet navigation={navigation} uid={uid} />
        </BottomSheet>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#62D3B4",
  },
  listItem: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // padding: 10,
    // borderBottomColor: "#D6D6D6",
    // height: 75,
  },
  text: {
    fontSize: 20,
    // backgroundColor: 'yellow',
    lineHeight: 20,
    color: 'grey'

  },
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 40,
    margin: 12,

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
  tabView: {
    margin: 10,
  },
  addUserBtn: {
    position: "absolute",
    right: 15,
    // padding: 10,
    alignSelf: "center",
    backgroundColor: '#C5F277',
    height: 38,
    width: 38,
    paddingLeft: 2.5,
    borderRadius: 40
  },
  bsSearchBar: {
    flex: 1,
    paddingLeft: 15,
    backgroundColor: "white",
    // width: '
    marginLeft: 35,
    borderRadius: 50,
  },
  bsSearchBtn: {
    // padding: 10,
    // paddingLeft: 0,
    // flex: 0.1,
    backgroundColor: "#C5F277",
    position: "absolute",
    left: 0,
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  bsSearchBarContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 15,
    height: 50,
    position: "relative",
    borderRadius: 50,

  },
  chatsList: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 12
  }
});

export default ChatsListScreen;
