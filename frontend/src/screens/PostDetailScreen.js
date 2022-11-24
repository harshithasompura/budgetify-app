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

const PostDetailScreen = ({navigation, route}) => {
    const [likesNum, setLikesNum] = useState(68);
    const [commentsNum, setCommentsNum] = useState(1);
    const [comments, setComments] = useState([
        {
            title: 'This is a title',
            username: 'morris',
            userPhoto: 
            'https://firebasestorage.googleapis.com/v0/b/budgetapp-14956.appspot.com/o/userAvatars%2Fpeter%40email.com?alt=media&token=db5a98b0-dfa7-41ea-b358-bcc2dfbdc7e0',
            createdAt: 'tempDate',
            review: 'My name is barry Allen, and I am the fastest man alive! To the outside world, I just an ordinary person.'
        },
        {
            title: 'This is a title',
            username: 'morris',
            userPhoto: 
            'https://firebasestorage.googleapis.com/v0/b/budgetapp-14956.appspot.com/o/userAvatars%2Fpeter%40email.com?alt=media&token=db5a98b0-dfa7-41ea-b358-bcc2dfbdc7e0',
            createdAt: 'tempDate',
            review: 'My name is barry Allen, '
        },
        {
            title: 'This is a title',
            username: 'morris',
            userPhoto: 
            'https://firebasestorage.googleapis.com/v0/b/budgetapp-14956.appspot.com/o/userAvatars%2Fpeter%40email.com?alt=media&token=db5a98b0-dfa7-41ea-b358-bcc2dfbdc7e0',
            createdAt: 'tempDate',
            review: 'My name is barry Allen, '
        },

    ]);

    const [item, setItem] = useState({
        title: 'This is a title',
        comment: "A law in the UK came into force in April 2022 that requires large businesses such as restaurants, takeaways, and cafes to display the calorie information of non-pre-packed food and soft drinks on their menus. It’s a strategy aimed to tackle obesity and give people a more informed choice of what goes down their gullets. According to the NHS (National Health Service), generally, the recommended daily intake of calories for male adults is 2,500 per day, while female adults should consume 2,000 to maintain their weight levels. For those of us who wish to drop a few pounds, experts advise us to consume fewer calories than the recommended daily number, eat a balanced diet, and increase our levels of physical activity. Being able to count calories and know how much we can eat is a great way to try and stay on track with our diet.",
        username: 'morris',
        userPhoto: 
        'https://firebasestorage.googleapis.com/v0/b/budgetapp-14956.appspot.com/o/userAvatars%2Fpeter%40email.com?alt=media&token=db5a98b0-dfa7-41ea-b358-bcc2dfbdc7e0',
        createdAt: 'tempDate',
        review: 'My name is barry Allen, and I am the fastest man alive! To the outside world, I just an ordinary person.'
    });

    return (
        <SafeAreaView>
            <View style={{ flexDirection: "row", position: "relative"}}>
                <Pressable
                    style={styles.backArrow}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="arrow-back-sharp" size={40} color="black" />
                </Pressable>
                <Text style={styles.title}>Edit Receipt</Text>
            </View>
        <ScrollView style={{marginBottom: 50}}>
            <View style={[styles.postContainer]}>
                <View style={styles.postHeader}>
                {/* Post header */}
                <Image style={styles.userAvatar} source={{ url: item.userPhoto }} />
                <View>
                    <Text style={[{marginLeft: 8, color: '#C5F277', fontSize: 20, fontWeight: 'bold' }]}>
                    {item.username}
                    </Text>
                    <Text style={[{marginLeft: 8, color: '#B17BFF', fontSize: 16}]}>{item.createdAt}</Text>
                </View>
                </View>
                <Text
                style={[
                    {
                    color: "#C5F277",
                    fontSize: 20,
                    marginHorizontal: 13,
                    paddingBottom: 20,
                    height: 35,
                    lineHeight: 35,
                    fontWeight: 'bold'
                    },
                ]}
                numberOfLines={2}
                >
                {item.title}
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
                            color: "#C5F277",
                            fontSize: 20,
                            marginHorizontal: 8,
                            lineHeight: 22,
                        },
                        ]}
                    > 
                        {item.comment}
                    </Text>
                </View>
                    <View style={styles.likeCommentContainer}>
                        <View style={styles.likeContainer}>
                            <EvilIcons name="like" size={35} color="#B17BFF" />
                            <Text style={styles.likeCommentNum}>{likesNum}</Text>
                        </View>
                        <View style={styles.commentContainer}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {

                                }}
                            >
                                <EvilIcons name="comment" size={35} color="#B17BFF" />
                            </TouchableOpacity>
                            <Text style={styles.likeCommentNum}>{commentsNum}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text 
                            style={[styles.likeCommentNum, {fontSize: 15, position: 'absolute', right: 15, bottom: 10 }]}
                            onPress={() => {

                            }}
                            >Add a comment</Text>
                    </TouchableOpacity>
            </View>
            <View style={[styles.commentsContainer]}>
                <Text style={{color: '#C5F277', margin: 15, fontSize: 20}}>Comments</Text>
                {
                    comments.map((item, index) => (
                        <View style={{flexDirection: 'row', marginHorizontal: 10 }} key={index}>
                            <Image style={styles.userAvatar} source={{ url: item.userPhoto }} />
                            <View style={styles.textsContainer}>
                                <Text style={{color: '#C5F277', fontWeight: 'bold'}}>{item.username}</Text>
                                <Text style={{color: '#B17BFF'}}>15 min ago</Text>
                                <Text style={{color: "#C5F277", marginTop: 10}}>{item.review}</Text>
                                {
                                    (index !== comments.length - 1) &&
                                    <View
                                        style={{
                                            borderBottomColor: '#C5F277',
                                            borderBottomWidth: 0.3,
                                            marginTop: 20
                                        }}
                                    />
                                }
                            </View>
                        </View>
                    ))
                }
            </View>

        </ScrollView>
        </SafeAreaView>
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
      left: 10,
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
    likeCommentNum: {
      fontSize: 20,
      lineHeight: 28,
      color: '#B17BFF'
    },
    backArrow: {
        // backgroundColor: 'green',
        width: 40,
        margin: 10,
    },
    title: {
        // backgroundColor: 'green',
        fontSize: 32,
        margin: 10,
        marginLeft: 0,
        fontWeight: "bold",
    },
    commentsContainer: {
        borderRadius: 25,
        backgroundColor: 'black', 
        margin: 10,
        marginTop: -2,
        shadowOffset:{width:0, height:5},  
        shadowColor:'#171717',  
        shadowOpacity:0.2,  
        shadowRadius:2,  
    },
    textsContainer: {
        position: 'relative',
        // backgroundColor: 'yellow',
        flex: 1,
        padding: 10
    }
  });

export default PostDetailScreen;
