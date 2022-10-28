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
import { useState, useEffect, useRef } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { db } from "../FirebaseApp";
import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const blankAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ChatsListScreen = ({ navigation }) => {
  const [userList, setUserList] = useState([]);
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

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

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
  }, [uid]);

  const layout = useWindowDimensions();

  const IndividualRoute = () => (
    <FlatList data={userList} renderItem={renderItem} />
  );

  const GroupRoute = () => (
    <FlatList data={groupsList} renderItem={renderItem} />
  );

  const renderScene = SceneMap({
    individual: IndividualRoute,
    group: GroupRoute,
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        let collectionId = item.id;
        let collectionName = item.isGroup ? "group-chats" : "private-chats";
        if (!item.isGroup) {
          const uid1 = uid;
          const uid2 = item.id;
          collectionId = uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
        }
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
      <Text style={styles.title}>Messages</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
        swipeEnabled={false}
      />
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
    padding: 15,
    marginLeft: 18,
    fontWeight: "bold",
  },
  tabView: {
    margin: 10,
  },
});

export default ChatsListScreen;
