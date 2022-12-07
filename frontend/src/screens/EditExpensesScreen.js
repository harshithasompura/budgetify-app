import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FirebaseApp";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../FirebaseApp";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import useExpenses from "../redux/hook/useExpenses";

const EditExpensesScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const images = [{ uri: route.params.imageUri }];
  const [visible, setIsVisible] = useState(false);
  const [merchant, setMerchant] = useState();
  const [total, setTotal] = useState();
  const [uid, setUid] = useState();
  const [selectedType, setSelectedType] = useState();
  // redux state
  const { fetchExpenses } = useExpenses();
  // useState for Expenses
  const [expenses, setExpenses] = useState({});

  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.email);
      } else {
        console.log("no signed-in user");
      }
    });

    if (route.params.receiptDate) {
      const dateArr = route.params.receiptDate.split("-");
      const year = parseInt(dateArr[0]);
      const month = parseInt(dateArr[1]) - 1;
      const day = parseInt(dateArr[2]);
      setDate(new Date(year, month, day));
    }
    if (route.params.merchant) {
      setMerchant(route.params.merchant);
    }
    if (route.params.total) {
      setTotal(route.params.total.toString());
    }

    return unsubscribeOnAuth;
  }, []);

  // Fetch all the expenses from firestore
  useEffect(() => {
    getAllExpensesFromFirestore();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const getAllExpensesFromFirestore = async () => {
    const docRef = doc(db, "users", uid, "expenses", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { summary } = docSnap.data();

      if (summary) {
        setExpenses(summary);
      } else {
        console.log("No data in summary");
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const uploadImageToCloud = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const file = await response.blob();
      const storage = getStorage();
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const imgRef = ref(storage, `receipts/${filename}`);
      await uploadBytes(imgRef, file);
      const receiptURL = await getDownloadURL(imgRef);
      return receiptURL;
    } catch (err) {
      console.log(err);
    }
  };

  const storeReceipt = async (merchant, total, date, receiptUrl) => {
    // const receiptToBeStored = {
    //   merchant: merchant,
    //   total: total,
    //   date: date,
    //   receiptUrl: receiptUrl,
    //   category: selectedType,
    // };

    // const docRef = doc(db, "expenses", uid);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   await updateDoc(doc(db, "expenses", uid), {
    //     receipts: arrayUnion(receiptToBeStored),
    //   });
    // } else {
    //   await setDoc(docRef, {
    //     receipts: [receiptToBeStored],
    //   });
    // }

    let tempAllExpenses = expenses;

    const tempObjectToBeStored = {
      merchant: merchant,
      total: parseFloat(total),
      date: moment(date).format("YYYY MMM DD"),
      receiptUrl: receiptUrl,
      category: selectedType,
    };

    console.log(tempObjectToBeStored["date"]);

    if (!tempAllExpenses[`${date.getFullYear()}`]) {
      tempAllExpenses[`${date.getFullYear()}`] = {};
    }
    if (!tempAllExpenses[`${date.getFullYear()}`][`${date.getMonth() + 1}`]) {
      tempAllExpenses[`${date.getFullYear()}`][`${date.getMonth() + 1}`] = {};
    }
    if (
      !tempAllExpenses[`${date.getFullYear()}`][`${date.getMonth() + 1}`][
        `${date.getDate()}`
      ]
    ) {
      tempAllExpenses[`${date.getFullYear()}`][`${date.getMonth() + 1}`][
        `${date.getDate()}`
      ] = [];
    }
    tempAllExpenses[`${date.getFullYear()}`][`${date.getMonth() + 1}`][
      `${date.getDate()}`
    ].push(tempObjectToBeStored);

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(doc(db, "users", uid, "expenses", uid), {
        summary: [tempAllExpenses],
      });
    }

    setExpenses(tempAllExpenses);

    Alert.alert("Receipt Saved", "", [
      { text: "OK", onPress: () => fetchExpenses(uid) },
    ]);

    // alert("Receipt stored");
    console.log("receipt stored");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", position: "relative" }}>
        <Pressable
          style={styles.backArrow}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <Ionicons name="arrow-back-sharp" size={40} color="black" />
        </Pressable>
        <Text style={styles.title}>Edit Receipt</Text>
      </View>
      <ScrollView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsVisible(true)}
        >
          <Image
            source={{ uri: route.params.imageUri }}
            style={styles.receiptSheet}
          ></Image>
        </TouchableOpacity>
        <View style={styles.receiptInfoContainer}>
          <Text style={styles.inputText}>Merchant name</Text>
          <TextInput
            placeholder="Not detected"
            autoCapitalize="none"
            returnKeyType="next"
            value={merchant}
            onChangeText={setMerchant}
            style={styles.inputBox}
          />
          <Text style={styles.inputText}>Total amount</Text>
          <TextInput
            placeholder="Not detected"
            autoCapitalize="none"
            returnKeyType="next"
            value={total}
            onChangeText={setTotal}
            style={styles.inputBox}
            keyboardType={"decimal-pad"}
          />
          <Text style={styles.inputText}>Receipt Date</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            display={"spinner"}
            themeVariant="dark"
            style={{ height: 90 }}
            textColor="white"
          />
          <Text style={[styles.inputText, { marginTop: 0 }]}>Receipt Type</Text>
          <PickerIOS
            style={{ height: 90 }}
            itemStyle={{
              height: 110,
              color: "white",
              fontFamily: "Montserrat_700Bold",
              shadowOpacity: 0.2,
              shadowColor: "white",
            }}
            selectedValue={selectedType}
            onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
          >
            <Picker.Item label="GROCERIES" value="Groceries" />
            <Picker.Item label="FOOD" value="Food" />
            <Picker.Item label="FUEL" value="Fuel" />
            <Picker.Item label="TRANSPORTATION" value="Transportation" />
            <Picker.Item label="ENTERTAINMENT" value="Entertainment" />
            <Picker.Item label="HOUSING" value="Housing" />
            <Picker.Item label="CLOTHING" value="Clothing" />
            <Picker.Item label="HEALTH" value="Health" />
            <Picker.Item label="OTHERS" value="Others" />
          </PickerIOS>
          <Pressable
            style={styles.confirmBtn}
            onPress={async () => {
              const receiptURL = await uploadImageToCloud(
                route.params.imageUri
              );
              await storeReceipt(merchant, total, date, receiptURL);
              navigation.popToTop();
            }}
          >
            <Text style={styles.confirmTxt}>Confirm</Text>
          </Pressable>
        </View>
        <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          animationType={"slide"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#D6D6D6",
    borderBottomWidth: 1,
    height: 75,
  },
  text: {
    // fontFamily: 'IBM Plex Mono',
    fontSize: 25,
    padding: 15,
    paddingLeft: 5,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 40,
  },
  backArrow: {
    // backgroundColor: 'green',
    width: 40,
    margin: 15,
    marginBottom: 0,
  },
  title: {
    // backgroundColor: 'green',
    fontSize: 22,
    marginBottom: 0,
    margin: 20,
    marginLeft: 0,
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
  },
  tabView: {
    margin: 10,
  },
  addUserBtn: {
    position: "absolute",
    right: 0,
    padding: 10,
    alignSelf: "center",
  },
  receiptSheet: {
    marginTop: 10,
    width: 380,
    height: 90,
    alignSelf: "center",
    borderRadius: 20,
  },
  receiptInfoContainer: {
    backgroundColor: "black",
    borderRadius: 20,
    height: 530,
    width: 380,
    alignSelf: "center",
    marginTop: 15,
  },
  inputBox: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "white",
    height: 50,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  inputText: {
    margin: 15,
    marginBottom: 0,
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    padding: 5,
  },
  receiptDate: {
    backgroundColor: "green",
  },
  confirmBtn: {
    backgroundColor: "#C5F277",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    margin: 12,
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    paddingHorizontal: 30,
  },
  confirmTxt: {
    fontSize: 20,
  },
});

export default EditExpensesScreen;
