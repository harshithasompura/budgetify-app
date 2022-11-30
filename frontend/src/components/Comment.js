import {
    View,
    Text,
    StyleSheet,
    Pressable,
  } from "react-native";
  import React, { useCallback, useRef, useState, useEffect } from "react";
  import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetScrollView} from "@gorhom/bottom-sheet";
  import { db } from "../../FirebaseApp";
  import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
  import { auth } from "../../FirebaseApp";

  const Comment = (props) => {
    const [comment, setComment] = useState("");
    const [uid, setUid] = useState();
    const [username, setUsername] = useState();

    const addComment = async () => {
      const commentToBeAdded = {
        comment: comment,
        createdAt: Timestamp.now(),
        userEmail: auth.currentUser.email
      };
  
      try {
        const docRef = doc(db, "post", props.postID);
        await updateDoc(docRef, {
          comments: arrayUnion(commentToBeAdded),
        });
        setComment("");
        props.callBack();
      } catch (err) {
        console.log(err);
      }
    }
    
    return (
      <BottomSheetView>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 8,
            position: 'relative'
          }}
        >
        <Text style={styles.bsTitle}>Create a Comment</Text>
        <Pressable style={styles.postButton} onPress={addComment}>
          <Text style={{ color: "black", fontSize: 19, fontWeight: 'bold' }}>Add</Text>
        </Pressable>
      </View>
      <View style={styles.descriptionInputBoxContainer}>
        <BottomSheetTextInput
          style={styles.descriptionInputBox}
          placeholder="Write a comment"
          value={comment}
          onChangeText={setComment}
          multiline={true}
          placeholderTextColor={'#BCBCBC'}
          color={'black'}
        />
      </View>
      </BottomSheetView>
    );
  };
  const styles = StyleSheet.create({
    descriptionInputBoxContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 15,
      height: 320,
      marginTop: 10,
      margin: 10
    },
    descriptionInputBox: {
      borderColor: "#ddd",
      // flex: 1,
      margin: 8,
      padding: 8,
      flex: 1,
      // paddingLeft: 15,
      backgroundColor: "#FFFFFF",
      fontSize: 16
      // width: '
      // marginRight: 10
      
    },
    postButton: {
      backgroundColor: "#C5F277",
      paddingVertical: 8,
      paddingHorizontal: 25,
      borderRadius: 20,
      position: 'absolute',
      right: 15,
  
      shadowOffset:{width:0, height:2},  
      shadowColor:'#171717',  
      shadowOpacity:0.2,  
      shadowRadius:2, 
    },
    bsTitle: {
      // backgroundColor: 'green',
      fontSize: 30,
      padding: 2,
      marginLeft: 18,
      fontWeight: "bold",
    },
  });
  
  export default Comment;
  