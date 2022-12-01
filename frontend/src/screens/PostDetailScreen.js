import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView
} from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { db } from "../../FirebaseApp";
import { auth } from "../../FirebaseApp";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  arrayRemove,
  arrayUnion,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { FloatingAction } from "react-native-floating-action";
import Comment from "../components/Comment.js";
import { calculateDateDiff } from "../../funcHelper.js";

const PostDetailScreen = ({navigation, route}) => {
    const [postInfo] = useState(route.params.item);
    const [likeButton, setLikeButton] = 
      postInfo.didCurrUserLike ? 
        useState('like1') : 
        useState('like2');
    const [likesNum, setLikesNum] = useState(postInfo.likesNum);
    const [commentsNum, setCommentsNum] = useState(postInfo.commentsNum);
    const [comments, setComments] = useState([]);

    const sheetRef = useRef(null);
    const snapPoints = ["70%", "75%"];
    const handleClosePress = () => sheetRef.current.close();
    const handleOpenPress = () => sheetRef.current.snapToIndex(0);

    const postRef = doc(db, 'post', postInfo.postID);

    useEffect(() => {
      fetchComments();
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.75}
          />
        ), []);

    const likeBtnPressed = async (didLike) => {
      try {
        await updateDoc(postRef, {
          likes: didLike ? 
                 arrayUnion(auth.currentUser.email) :
                 arrayRemove(auth.currentUser.email)
        });
        didLike ? setLikesNum(likesNum + 1) :
                  setLikesNum(likesNum - 1)
      } catch (err) {
        console.log(err);
      }
    }

    const fetchComments = async () => {
      try {
        const post = await getDoc(postRef);
        const commentsPromises = post.data().comments.map(async (comment) => {
          const userRef = doc(db, "users", comment.userEmail);
          const user = await getDoc(userRef);

          let createdAt;
          if (comment.createdAt) {
            createdAt = calculateDateDiff(
              comment.createdAt.toDate(),
              Timestamp.now().toDate()
            );
          }

          return {
            comment: comment.comment,
            createdAt: createdAt,
            userAvatar: user.data().icon,
            username: user.data().name
          }
        });

        const commentsFromFirebase = await Promise.all(commentsPromises);
        setComments(commentsFromFirebase);
        setCommentsNum(commentsFromFirebase.length);
      } catch (err) {
        console.log(err);
      }
      
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6F6'}}>
            <View style={{ flexDirection: "row", position: "relative", alignItems:"center", marginTop:10}}>
                <Pressable
                    style={styles.backArrow}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="arrow-back-sharp" size={28} color="black" />
                </Pressable>
                <Text style={styles.title}>Back to Feed</Text>
            </View>
        <ScrollView style={{marginVertical: 10, }} showsVerticalScrollIndicator={false}>
            <View style={[styles.postContainer]}>
                <View style={styles.postHeader}>
                {/* Post header */}
                <Image style={styles.userAvatar} source={{ url: postInfo.userAvatar }} />
                <View>
                    <Text style={[{marginLeft: 8, color: 'black', fontSize: 18, fontFamily:"Montserrat_600SemiBold" }]}>
                    {postInfo.username}
                    </Text>
                    <Text style={[{marginLeft: 8, color: '#BCBCBC', fontSize: 16,  fontFamily:"Montserrat_600SemiBold",}]}>{postInfo.createdAt}</Text>
                </View>
                </View>
                <Text
                style={[
                    {
                    color: "black",
                    fontSize: 18,
                    marginHorizontal: 13,
                    paddingBottom: 20,
                    height: 35,
                    lineHeight: 35,
                    fontFamily:"Montserrat_700Bold",
                    fontWeight: 'bold'
                    },
                ]}
                numberOfLines={2}
                >
                {postInfo.title}
                </Text>
                <View style={
                    { 
                        marginHorizontal: 5,
                        borderRadius: 10,
                        marginBottom: 50
                    }}>
                    <Text
                        style={[
                        {
                            color: "black",
                            fontSize: 16,
                            fontFamily:"Montserrat_400Regular",
                            marginHorizontal: 8,
                            lineHeight: 22,
                        },
                        ]}
                    > 
                        {postInfo.description}
                    </Text>
                </View>
                    <View style={styles.likeCommentContainer}>
                        <View style={styles.likeContainer}>
                            <Pressable
                                activeOpacity={0.7}
                                onPress={() => {
                                  if (likeButton === 'like2') {
                                    setLikeButton('like1');
                                    likeBtnPressed(true);
                                  } else {
                                    setLikeButton('like2');
                                    likeBtnPressed(false); 
                                  }
                                }}
                            >
                                <AntDesign name={likeButton} size={22} color="#B17BFF" />
                            </Pressable>
                            <Text style={styles.likeCommentNum}>{likesNum}</Text>
                        </View>
                        <View style={styles.commentContainer}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={fetchComments}
                            >
                                <AntDesign name="message1" size={22} color="#B17BFF" />
                            </TouchableOpacity>
                            <Text style={styles.likeCommentNum}>{commentsNum}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleOpenPress}>
                        <Text 
                            style={[styles.likeCommentNum, {fontSize: 15, position: 'absolute', right: 15, bottom:-10, color: '#B17BFF', fontWeight: '600', fontFamily:"Montserrat_600SemiBold" }]}
                            >Add a comment</Text>
                    </TouchableOpacity>
            </View>
            <View style={[styles.commentsContainer]}>
                <Text style={{color: 'black', margin: 15, fontSize: 18, fontFamily:"Montserrat_400Regular"}}>Comments</Text>
                {
                    comments && comments.map((item, index) => (
                        <View style={{flexDirection: 'row', marginHorizontal: 10 }} key={index}>
                            <Image style={styles.userAvatar} source={{ url: item.userAvatar }} />
                            <View style={styles.textsContainer}>
                                <Text style={{color: 'black', fontWeight: 'bold', fontFamily:"Montserrat_700Bold"}}>{item.username}</Text>
                                <Text style={{color: '#BCBCBC', fontFamily:"Montserrat_600SemiBold"}}>{item.createdAt}</Text>
                                <Text style={{color: "black", marginTop: 10, fontFamily:"Montserrat_400Regular", paddingBottom:20}}>{item.comment}</Text>
                                {
                                    (index !== comments.length - 1) &&
                                    <View
                                        style={{
                                            borderBottomColor: 'grey',
                                            borderBottomWidth: 1,
                                            marginTop: 20,
                                            opacity: 0.5
                                        }}
                                    />
                                }
                            </View>
                        </View>
                    ))
                }
            </View>

        </ScrollView>
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{backgroundColor: '#62D3B4'}}
          >
            <BottomSheetView>
              <Comment 
                postID={postInfo.postID}
                callBack={() => {
                  fetchComments();
                  handleClosePress();
                }}
              />
            </BottomSheetView>
          </BottomSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screenHeading: {
      fontSize: 30,
      fontWeight: "400"
    },
    icon: {
      padding: 3,
    },
    postFeed: {
      flex: 2,
      height: "100%",
      alignSelf:"stretch",
      width:"100%",
    },
    postContainer: {
      backgroundColor: '#FFFFFF',
      height: 230,
      padding:10,
      marginBottom:10,
      // shadowOffset:{width:0, height:1},  
      // shadowColor:'#171717',  
      // shadowOpacity:0.1,  
      // shadowRadius:1,  
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      position: 'relative',
    },
    userAvatar: {
      height: 50,
      width: 50,
      borderRadius: 40,
      marginLeft: 8,
      marginTop: 8
    },
  
  
    likeCommentContainer: {
      paddingHorizontal:10,
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
      fontSize: 18,
      lineHeight: 28,
      color: '#8E7CF7',
      marginLeft: 5
    },
    backArrow: {
        // backgroundColor: 'green',
        width: 40,
        alignItems:"center",
        marginHorizontal:10,
    },
    title: {
        // backgroundColor: 'green',
        fontFamily:"Montserrat_600SemiBold",
        fontSize: 22,
        margin: 10,
        marginLeft: 0,
        fontWeight: "bold",
        color:"black",
    },
    commentsContainer: {
        backgroundColor: '#FFFFFF', 
        // margin: 10,
        marginTop: 5,
        // shadowOffset:{width:0, height:5},  
        // shadowColor:'#171717',  
        // shadowOpacity:0.2,  
        // shadowRadius:2,  
    },
    textsContainer: {
        position: 'relative',
        // backgroundColor: 'yellow',
        flex: 1,
        padding: 10
    }
  });

export default PostDetailScreen;
