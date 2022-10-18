import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
// Importing fonts
import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

const ExpensesScreen = ({ navigation }) => {
  // const [isCameraVisible, setCameraVisible] = useState(false);

  const [openDropDown, setOpenDropDown] = useState(false);
  const [dropDownValue, setDropDownValue] = useState(null);
  const [dropDownItems, setDropDownItems] = useState([
    {
      label: "Camera",
      value: "camera",
      icon: () => <Icon name="camera" size={20} />,
    },
    {
      label: "Fill in the Form",
      value: "form",
      icon: () => <Icon name="pencil" size={25} />,
    },
  ]);

  const dropDownChange = (value) => {
    if (value === "camera") {
      navigation.navigate("Camera");
      setDropDownValue(null);
      return;
    } else if (value === "form") {
      navigation.navigate("New Expense");
      setDropDownValue(null);
      return;
    }
  };

  let [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  });
  if (!fontsLoaded) {
    return <Text>Fonts are loading...</Text>;
  } else {
    // ------------------------ View Template -----------------------
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <Text
              style={[
                styles.screenHeading,
                { fontFamily: "IBMPlexMono_500Medium" },
              ]}
            >
              Expenses
            </Text>
          </View>

          <View style={styles.dropDownView}>
            <DropDownPicker
              open={openDropDown}
              value={dropDownValue}
              items={dropDownItems}
              setOpen={setOpenDropDown}
              setValue={setDropDownValue}
              onChangeValue={(value) => dropDownChange(value)}
              placeholder="Select Input Method"
              textStyle={{ fontSize: 17 }}
            />
          </View>
          {/* {!isCameraVisible && 
          <Pressable style={styles.camera} onPress={()=>{
              // Navigate to Register
              navigation.navigate("Camera");
          }}>
            <Icon name="camera" size={20} />
          </Pressable>
          } */}
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  screenHeading: {
    fontSize: 30,
    fontWeight: "400",
    marginVertical: 30,
  },
  dropDownView: {
    height: 30,
    width: "50%",
    marginVertical: 30,
  },
  camera: {
    alignSelf: "flex-end",
    marginVertical: -60,
    marginHorizontal: 30,
  },
  inputExpenses: {
    marginBottom: 10,
    alignSelf: "center",
    backgroundColor: "#CCD1D1",
  },
});

export default ExpensesScreen;
