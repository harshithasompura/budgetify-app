import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { db } from "../../FirebaseApp";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
const Post = (props) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState();

  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(() => {
          return user.email;
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
  const addPost = async () => {
    if (
      comment === "" ||
      title === "" ||
      comment.trim().length === 0 ||
      title.trim().length === 0
    ) {
      Alert.alert("Title/Description cannot be empty!");
      return;
    }

    try {
      await addDoc(collection(db, "post"), {
        userEmail: userEmail,
        title: title.trim(),
        description: comment.trim(),
        createdAt: Timestamp.now(),
        comments: [],
        likes: [],
      });
      // Post is successful
      setComment("");
      setTitle("");
      props.postResult(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BottomSheetView>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 8,
          position: "relative",
        }}
      >
        <Text style={styles.bsTitle}>Create a Post</Text>
        <Pressable style={styles.postButton} onPress={addPost}>
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: "Montserrat_700Bold",
            }}
          >
            Post
          </Text>
        </Pressable>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
        <BottomSheetTextInput
          style={styles.titleInputBox}
          placeholder="Enter a title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={"#BCBCBC"}
          color={"black"}
        />
      </View>
      <View style={styles.descriptionInputBoxContainer}>
        <BottomSheetTextInput
          style={styles.descriptionInputBox}
          placeholder="Enter a description"
          value={comment}
          onChangeText={setComment}
          onSubmitEditing
          multiline={true}
          placeholderTextColor={"#BCBCBC"}
          color={"black"}
        />
      </View>
    </BottomSheetView>
  );
};
const styles = StyleSheet.create({
  titleInputBox: {
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15,
    flex: 1,
    paddingLeft: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    // shadowOffset:{width:0, height:5},
    // shadowColor:'#171717',
    // shadowOpacity:0.2,
    // shadowRadius:2,
  },
  descriptionInputBoxContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    height: 320,
    marginTop: 10,
    margin: 10,

    // shadowOffset:{width:0, height:5},
    // shadowColor:'#171717',
    // shadowOpacity:0.2,
    // shadowRadius:2,
  },
  descriptionInputBox: {
    borderColor: "#ddd",
    // flex: 1,
    margin: 8,
    padding: 8,
    flex: 1,
    // paddingLeft: 15,
    backgroundColor: "#FFFFFF",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
    // width: '
    // marginRight: 10
  },
  postButton: {
    backgroundColor: "#C5F277",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    position: "absolute",
    right: 15,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bsTitle: {
    fontFamily: "Montserrat_700Bold",
    color: "#fff",
    fontSize: 24,
    padding: 2,
    marginLeft: 18,
    fontWeight: "bold",
  },
});

export default Post;
