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
} from "firebase/firestore";

const blankAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ChatsListScreen = ({ navigation }) => {
  const snapPoints = ["75%"];
  const sheetRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [chatsList, setChatsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [uid, setUid] = useState();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "individual", title: "Individual" },
    { key: "group", title: "Group" },
  ]);

  const didMount = useRef(false);

  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.email);
      } else {
        console.log("no signed-in user");
      }
    });

    const groupQuery = query(collection(db, "group-chats"), orderBy("name"));
    const unsubscribeGroups = onSnapshot(groupQuery, (querySnapshot) => {
      const groupsFromFB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        icon: doc.data().icon,
        name: doc.data().name,
        isGroup: doc.data().isGroup,
      }));
      setGroupsList(groupsFromFB);
    });

    return () => {
      unsubscribeGroups();
      unsubscribeOnAuth();
    };
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
            return {
              id: document.id,
              name: docSnap.data().name,
              icon: docSnap.data().icon,
            };
          }
        }
      });

      //wait until all promises resolved
      const chatsFromFB = await Promise.all(chatsPromises);
      setChatsList(chatsFromFB);
    });

    return unsubscribeChats;
  }, [uid]);

  const layout = useWindowDimensions();

  const IndividualRoute = () => (
    <FlatList data={chatsList} renderItem={renderItem} />
  );

  const GroupRoute = () => (
    <FlatList data={groupsList} renderItem={renderItem} />
  );

  const renderScene = SceneMap({
    individual: IndividualRoute,
    group: GroupRoute,
  });

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        let collectionId = item.id;
        let collectionName = item.isGroup ? "group-chats" : "private-chats";
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
          {item.icon !== "" && (
            <Image style={styles.avatar} source={{ url: item.icon }} />
          )}
          {item.icon === "" && (
            <Image style={styles.avatar} source={{ url: blankAvatarUrl }} />
          )}
          <Text style={styles.text}> {item.name} </Text>
        </View>
        <FontAwesome name="angle-right" size={30} color="black" />
      </View>
    </TouchableOpacity>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "#C5F277",
        height: 5,
        borderRadius: 5,
      }}
      indicatorContainerStyle={{ backgroundColor: "#blue" }}
      style={{ backgroundColor: "black", borderRadius: 10 }}
      renderLabel={({ route }) => (
        <Text style={{ color: "#C5F277", fontSize: 20 }}>{route.title}</Text>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backArrow}
        onPress={() => {
          navigation.popToTop();
        }}
      >
        <Ionicons name="arrow-back-sharp" size={40} color="black" />
      </Pressable>
      <View style={{ flexDirection: "row", position: "relative" }}>
        <Text style={styles.title}>Messages</Text>

        <Pressable style={styles.addUserBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add-circle" size={40} color="black" />
        </Pressable>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
        swipeEnabled={false}
      />

      {isOpen ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setOpen(false)}
          backdropComponent={renderBackdrop}
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
    backgroundColor: "white",
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
  tabView: {
    margin: 10,
  },
  addUserBtn: {
    position: "absolute",
    right: 0,
    padding: 10,
    alignSelf: "center",
  },
});

export default ChatsListScreen;
