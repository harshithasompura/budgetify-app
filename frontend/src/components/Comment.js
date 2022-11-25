import {
    View,
    Text,
    StyleSheet,
    Pressable,
  } from "react-native";
  import React, { useCallback, useRef, useState, useEffect } from "react";
  import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetScrollView } from "@gorhom/bottom-sheet";
  import { db } from "../../FirebaseApp";
  import { collection, addDoc, serverTimestamp } from "firebase/firestore";
  import { auth } from "../../FirebaseApp";
  import { onAuthStateChanged } from "firebase/auth";
  const Comment = (props) => {
    const [comment, setComment] = useState("");
    const [uid, setUid] = useState();
    const [username, setUsername] = useState();
    const blankAvatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBGwlAahaapmmJ7Riv_L_ZujOcfWSUJnm71g&usqp=CAU`;
    
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
        <Pressable style={styles.postButton} onPress={() => {}}>
          <Text style={{ color: "black", fontSize: 19 }}>Add</Text>
        </Pressable>
      </View>
      <View style={styles.descriptionInputBoxContainer}>
        <BottomSheetTextInput
          style={styles.descriptionInputBox}
          placeholder="Write a comment"
          onChangeText={setComment}
          multiline={true}
          placeholderTextColor={'#B17BFF'}
          color={'#C5F277'}
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
      backgroundColor: "black",
      borderRadius: 15,
      fontSize: 16,
  
      shadowOffset:{width:0, height:5},  
      shadowColor:'#171717',  
      shadowOpacity:0.2,  
      shadowRadius:2,  
    },
    descriptionInputBoxContainer: {
      backgroundColor: "black",
      borderRadius: 15,
      height: 320,
      marginTop: 10,
      margin: 10,
  
      shadowOffset:{width:0, height:5},  
      shadowColor:'#171717',  
      shadowOpacity:0.2,  
      shadowRadius:2, 
  
    },
    descriptionInputBox: {
      borderColor: "#ddd",
      // flex: 1,
      margin: 8,
      padding: 8,
      flex: 1,
      // paddingLeft: 15,
      backgroundColor: "black",
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
  