import { View, Text, StyleSheet } from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";

const Post = () => {
   
  return (
    <View style={styles.container}>
      <Text>Create a Post</Text>

    </View>
  )

}
const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
    },
});

export default Post