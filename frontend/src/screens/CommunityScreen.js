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
import { EvilIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
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
  const [likesNum, setLikesNum] = useState(0);
  const [commentsNum, setCommentsNum] = useState(5);

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

    return (
      <Pressable
        style={[styles.postContainer]}
        onPress={() => {
          navigation.navigate("Post Detail", {item: item});
        }}
      >
        <View style={styles.postHeader}>
          {/* Post header */}
          <Image style={styles.userAvatar} source={{ url: item.userAvatar }} />
          <View>
            <Text style={[{marginLeft: 8, color: '#C5F277', fontSize: 20 }]}>
              {item.username}
            </Text>
            <Text style={[{marginLeft: 8, color: '#B17BFF', fontSize: 16}]}>{item.createdAt}</Text>
          </View>
        </View>
        <Text
          style={[
            {
              color: "#C5F277",
              // fontFamily: "IBMPlexMono_700Bold",
              fontSize: 20,
              marginHorizontal: 13,
              paddingBottom: 10,
              // backgroundColor: 'blue',
              // height: 35,
              // lineHeight: 35,
              fontWeight: 'bold'
            },
          ]}
          numberOfLines={2}
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
            {item.description}
          </Text>
        </View>
        <View style={styles.likeCommentContainer}>
          <View style={styles.likeContainer}>
            <AntDesign style={styles.likeComment} name="like2" size={25} color="#B17BFF" />
            <Text style={styles.likeCommentNum}>{likesNum}</Text>
          </View>
          <View style={styles.commentContainer}>
            <AntDesign style={styles.likeComment} name="message1" size={25} color="#B17BFF" />
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
    const unsubscribePosts = onSnapshot(postQuery, async (querySnapshot) => {
      const postsPromises = querySnapshot.docs.map(async (post) => {
        const docRef = doc(db, "users", post.data().userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          var minutes = "";
          if (post.data().createdAt) {
            const date = post.data().createdAt.toDate();
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

          return {
            userAvatar: docSnap.data().icon,
            username: docSnap.data().name,
            title: post.data().title,
            description: post.data().description,
            createdAt: minutes
          }
        } else {
          console.log("No such document!");
        }
      });
      const postsFromFirebase = await Promise.all(postsPromises);
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
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{height: 10}} />}
                  style={{ borderRadius: 25, margin: 10, marginTop: 0}}
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
    left: 15
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
    color: '#B17BFF',
    marginLeft: 5
  }
});

export default CommunityScreen;
