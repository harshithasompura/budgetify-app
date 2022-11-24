import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { EvilIcons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import Post from "../components/Post.js";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { db } from "../../FirebaseApp";
import { auth } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { FloatingAction } from "react-native-floating-action";

const CommunityScreen = ({ navigation, route }) => {
  // State Variables
  const [isOpen, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = ["75%", "100%"];
  const [postsList, setPostsList] = useState([]);
  const [likeButton, setLikeButton] = useState("heart-outline");
  const [postBtnVisible, setPostBtnVisible] = useState(true);
  const [likesNum, setLikesNum] = useState(68);
  const [commentsNum, setCommentsNum] = useState(1);

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

  const renderItem = ({ item }) => {
    const date = item.createdAt;
    var minutes;
    if (date === "") {
      minutes = "";
    } else {
      minutes =
        date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
    }
    return (
      <Pressable
        style={[styles.postContainer]}
        onPress={() => {
          navigation.navigate("Post Detail");
        }}
      >
        <View style={styles.postHeader}>
          {/* Post header */}
          <Image style={styles.userAvatar} source={{ url: item.userPhoto }} />
          <View>
            <Text style={[{marginLeft: 8, color: '#C5F277', fontSize: 20 }]}>
              {item.username}
            </Text>
            <Text style={[{marginLeft: 8, color: '#B17BFF', fontSize: 16}]}>{minutes}</Text>
          </View>
        </View>
        <Text
          style={[
            {
              color: "#C5F277",
              // fontFamily: "IBMPlexMono_700Bold",
              fontSize: 20,
              marginHorizontal: 13,
              paddingBottom: 20,
              // backgroundColor: 'blue',
              height: 35,
              lineHeight: 35,
              fontWeight: 'bold'
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={
              { backgroundColor: 'black',
                marginHorizontal: 5,
                height: 82,
                borderRadius: 10,
                opacity: 0.9
              }}>
          <Text
            style={[
              {
                color: "#C5F277",
                // fontFamily: "IBMPlexMono_400Regular",
                fontSize: 20,
                marginHorizontal: 8,
                height: 82,
                lineHeight: 22,
                // backgroundColor: 'green'
              },
            ]}
            numberOfLines={3}
          > 
            {item.comment}
          </Text>
        </View>
        <View style={styles.likeCommentContainer}>
          <View style={styles.likeContainer}>
            <EvilIcons style={styles.likeComment} name="like" size={35} color="#B17BFF" />
            <Text style={styles.likeCommentNum}>{likesNum}</Text>
          </View>
          <View style={styles.commentContainer}>
            <EvilIcons style={styles.likeComment} name="comment" size={35} color="#B17BFF" />
            <Text style={styles.likeCommentNum}>{commentsNum}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    const postQuery = query(
      collection(db, "post"),
      orderBy("createdAt", "desc")
    );
    const unsubscribePosts = onSnapshot(postQuery, (querySnapshot) => {
      const postsFromFirebase = querySnapshot.docs.map((doc) => ({
        title: doc.data().title,
        comment: doc.data().comment,
        username: doc.data().username,
        userPhoto: doc.data().userAvatar,
        createdAt:
          doc.data().createdAt === null ? "" : doc.data().createdAt.toDate(),
        // name: doc.data().name,
        // isGroup: doc.data().isGroup,
      }));
      setPostsList(postsFromFirebase);
    });
    return () => {
      unsubscribePosts();
    };
  }, []);

  const actions = [
    {
      icon: <Icon name="plus" color={"black"} size={30} style={{height: 28}} />,
      name: "Post"
    }
  ];

  return (
    <View
      style={[
        styles.container
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 50,
          marginHorizontal: 20,
          marginTop: 10,
        }}
      >
        {/* Header: Title + Chat button/icon */}
        <Text
          style={[styles.screenHeading, {fontWeight: 'bold'}]}
        >
          My Feeds
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Chats List");
          }}
        >
          <Ionicons style={styles.icon} name="chatbox-ellipses" size={35} />
        </TouchableOpacity>
      </View>
      <View style={[styles.postFeed, {backgroundColor: 'white'}]}>
        {/* Post feed should go here */}
        <FlatList data={postsList} 
                  renderItem={renderItem} 
                  onScrollEndDrag={() => setPostBtnVisible(true)}
                  onScrollBeginDrag={() => setPostBtnVisible(false)}
                  />
        <View style={{position: 'absolute', right: -10, bottom: -10}}>
          <FloatingAction
            // buttonSize={50}
            visible={postBtnVisible}
            actions={actions}
            overrideWithAction={true}
            color={'#C5F277'}
            onPressItem={() => {
              setOpen(true);
            }}
          />
        </View>
      </View>

      {isOpen ? (
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setOpen(false)}
            backdropComponent={renderBackdrop}
          >
            <BottomSheetView>
              <Post
                postResult={(data) => {
                  if (data === true) {
                    setOpen(false);
                  }
                }}
              />
            </BottomSheetView>
          </BottomSheet>
        ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenHeading: {
    fontSize: 30,
    fontWeight: "400"
  },
  icon: {
    padding: 3,
  },
  plusIcon: {
    backgroundColor: "#001c00",
    width: 50,
    height: 50,
    // marginHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 20,
    alignSelf: "flex-end",
  },
  postFeed: {
    flex: 2,
    height: "100%",
  },
  postContainer: {
    borderRadius: 25,
    backgroundColor: 'black', 
    margin: 10,
    height: 235,

    shadowOffset:{width:0, height:5},  
    shadowColor:'#171717',  
    shadowOpacity:0.2,  
    shadowRadius:2,  
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: 'relative',
  },
  userAvatar: {
    height: 45,
    width: 45,
    borderRadius: 40,
    marginLeft: 8,
    marginTop: 8
  },


  likeCommentContainer: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    position: 'absolute',
    bottom: 10,
    left: 10
  },
  likeContainer: {
    flexDirection: 'row',
    // backgroundColor: 'yellow',
    marginRight: 10,
    
  },
  commentContainer: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
    position: 'absolute',
    left: 70
  },
  likeComment: {

  },
  likeCommentNum: {
    fontSize: 20,
    lineHeight: 28,
    color: '#B17BFF'
  }
});

export default CommunityScreen;
