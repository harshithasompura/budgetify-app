import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { db } from "../FirebaseApp";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth } from "../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { View } from "react-native";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState();
  const [username, setUsername] = useState();

  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUsername(() => {
          return user.email.split("@")[0];
        });
      } else {
        console.log("no signed-in user");
      }
    });

    const q = query(collection(db, "chat-room"), orderBy("createdAt", "desc"));
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
      unsubscribeSnapshot();
      unsubscribeOnAuth();
    };
  }, []);

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    try {
      await addDoc(collection(db, "chat-room"), {
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
    <View style={{ backgroundColor: "#3B4857", flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: username,
        }}
        wrapInSafeArea={false}
        renderUsernameOnMessage={true}
        renderAvatar={null}
      />
    </View>
  );
};

export default ChatScreen;
