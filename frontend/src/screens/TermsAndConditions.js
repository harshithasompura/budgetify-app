import React from "react";
import WebView from "react-native-webview";
import { SafeAreaView } from "react-native";
const TermsAndConditions = ({ route, navigation }) => {
  let url = route.params;
  // console.log(`URL FOund: ${url}`)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text>Terms Screen</Text> */}
      <WebView source={{ uri: url }} />
    </SafeAreaView>
  );
};

export default TermsAndConditions;
