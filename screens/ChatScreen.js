import { StyleSheet, Text, View, TextInput, Pressable, Alert, FlatList, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { db } from "../FirebaseApp";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc
} from "firebase/firestore";
import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";

const blankAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const ChatScreen = ({ navigation, route }) => {
  
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState();
  const [username, setUsername] = useState();
  const [collectionId] = useState(route.params.collectionId);
  const [collectionName] = useState(route.params.collectionName);
  const [objectIcon] = route.params.objectIcon === '' ? useState(blankAvatarUrl): useState(route.params.objectIcon);
  const [objectName] = useState(route.params.objectName);
  const [senderIcon, setSenderIcon] = useState(blankAvatarUrl);

  useEffect(() => {
    navigation.setOptions({tabbarstyle: { display: "none" }});
    const unsubscribeOnAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.email);
        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().name);
          setSenderIcon(docSnap.data().icon);
        } else {
          setUsername(() => {
            return user.email.split("@")[0];
          });
        }
      } else {
        console.log("no signed-in user");
      }
    });

    const chatsRef = collection(db, collectionName, collectionId, 'messages');
    const q = query(chatsRef, orderBy("createdAt", "desc"));
    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));
      setMessages(messages);
    });

    return () => {
      unsubscribeOnAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    try {
      await addDoc(collection(db, collectionName, collectionId, 'messages'), {
        _id,
        createdAt,
        text,
        user,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>

      <View style={styles.chatTitleContainer}>
        <Pressable style={styles.backArrow} onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back-sharp" size={40} color='#C5F277' />
        </Pressable>
        <Image style={styles.avatar} source={{url: objectIcon}} />
        <Text style={styles.title}>{objectName}</Text>
      </View>
      <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: uid,
            name: username,
            avatar: senderIcon
          }}
          wrapInSafeArea={false}
          renderUsernameOnMessage={true}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: '#C5F277',
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: 'black',
                  },
                }}
              />
            );
          }}
      />
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: 'white',
  },
  listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderBottomColor: "#D6D6D6",
      borderBottomWidth: 1,
      height: 75
  },
  text: {
      // fontFamily: 'IBM Plex Mono',
      fontSize: 25,
      padding: 15,
      paddingLeft: 5
  },
  avatar: {
      height: 50, 
      width: 50,
      borderRadius: 40,
      marginTop: 5,
      marginBottom: 5,
  },
  backArrow: {
      // backgroundColor: 'green',
      width: 40,
      // marginLeft: 15,
      // marginTop: 15,
      margin: 10,
      marginLeft: 5

  },
  title: {
      // backgroundColor: 'green',
      fontSize: 20,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 5,
      fontWeight: 'bold',
      color: '#C5F277'
  },
  tabView: {
      margin: 10,
  },
  chatTitleContainer: {
    flexDirection: "row",
    alignContent: 'center',
    padding: 5,
    backgroundColor: "black",
    // borderRadius: 60
  }
});

export default ChatScreen;
