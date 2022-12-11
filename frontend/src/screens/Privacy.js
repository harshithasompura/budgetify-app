import React from "react";
import WebView from "react-native-webview";
import { SafeAreaView } from "react-native";

const Privacy = ({ route }) => {
  let url = route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text>Privacy Screen</Text> */}
      <WebView source={{ uri: url }} />
    </SafeAreaView>
  );
};

export default Privacy;
