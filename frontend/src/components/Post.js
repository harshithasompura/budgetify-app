import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { db } from "../../FirebaseApp";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
const Post = (props) => {
  const [comment, setComment] = useState("");
  const [uid, setUid] = useState();
  const [username, setUsername] = useState();
  const blankAvatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBGwlAahaapmmJ7Riv_L_ZujOcfWSUJnm71g&usqp=CAU`;

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
    return () => {
      unsubscribeOnAuth();
    };
  }, []);

  //Handlers
  const addComment = async () => {
    try {
      await addDoc(collection(db, "post"), {
        username,
        userAvatar: blankAvatar,
        uid,
        createdAt: serverTimestamp(),
        comment,
        likesCount: 0,
        replyComment: [],
      });
      // Post is successful
      props.postResult(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginVertical: 10,
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Text style={{ fontSize: 19, fontWeight: "bold", flex: 1 }}>
          Create a Post
        </Text>
        <Pressable style={styles.postButton} onPress={addComment}>
          <Text style={{ color: "white" }}>Post</Text>
        </Pressable>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
        {/* Post */}
        <Image
          style={styles.logo}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBGwlAahaapmmJ7Riv_L_ZujOcfWSUJnm71g&usqp=CAU",
          }}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Post a question"
          onChangeText={setComment}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
    margin: 10,
  },
  logo: {
    width: 66,
    height: 58,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    margin: 10,
    padding: 5,
  },
  postButton: {
    backgroundColor: "#001c00",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
});

export default Post;
