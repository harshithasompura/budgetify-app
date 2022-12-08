import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  View,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";

import moment from "moment";

// Firebase
import { db } from "../../FirebaseApp";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";

// Redux
import useExpenses from "../redux/hook/useExpenses";

// import { Icon } from "@rneui/base";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { async } from "@firebase/util";

const ExpensesDetailScreen = ({ route, navigation }) => {
  const { category, userEmail } = route.params;

  const [expensesData, setExpensesData] = useState([]);

  // redux state
  const { fetchExpenses } = useExpenses();

  useEffect(() => {
    getExpensesFromFirestore();
  }, []);

  const getExpensesFromFirestore = async () => {
    const docRef = doc(db, "users", userEmail, "expenses", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { summary } = docSnap.data();

      const date = new Date();

      const tempMonthExpenses =
        summary[date.getFullYear()][date.getMonth() + 1];

      const temp = [];
      Object.entries(tempMonthExpenses).forEach((item) => {
        item[1].forEach((innerItem) => {
          if (innerItem.category === category) temp.push(innerItem);
        });
      });
      setExpensesData(temp);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  // FlatList render function and other related functions
  const renderFlatListItem = ({ item }) => {
    const { date, total, receiptUrl, merchant } = item;
    const expense = parseFloat(total);

    return (
      <View style={[styles.flatListCell, { flex: 1 }]}>
        <View style={[styles.flatListLeftPart, { padding: 8 }]}>
          {receiptUrl && (
            <Pressable
              style={{ flex: 1, height: "90%" }}
              onPress={async () => {
                // Open Receipt URL on press
                const supported = await Linking.canOpenURL(receiptUrl);
                if (supported) {
                  // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                  // by some browser in the mobile
                  await Linking.openURL(receiptUrl);
                } else {
                  Alert.alert(`Don't know how to open this URL: ${receiptUrl}`);
                }
              }}
            >
              <Image
                style={{ width: "60%", height: "100%" }}
                resizeMode="contain"
                source={{ uri: receiptUrl }}
              />
            </Pressable>
          )}
          <View
            style={
              receiptUrl
                ? { width: "100%", flex: 2, padding: 0 }
                : { flex: 1, width: "100%", padding: 8 }
            }
          >
            <View style={{ paddingTop: 10 }}>
              {merchant && (
                <Text style={[styles.flatListDate, { color: "black" }]}>
                  {merchant}
                </Text>
              )}
              <Text style={styles.flatListDate}>Date: {date}</Text>
              <Text style={styles.flatListExpenses}>$ {expense}</Text>
            </View>
          </View>
        </View>
        <Button
          style={{ flex: 1 }}
          color="#dc3545"
          title=" Delete"
          type="clear"
          onPress={() => validateDelete(date, expense)}
        />
      </View>
    );
  };

  const validateDelete = (date, expense) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("OK Pressed");
            deleteExpense(date, expense);
          },
        },
      ]
    );
  };

  const deleteExpense = async (date, expense) => {
    const docRef = doc(db, "users", userEmail, "expenses", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { summary } = docSnap.data();

      const currDate = new Date();

      const tempMonthExpenses =
        summary[currDate.getFullYear()][currDate.getMonth() + 1];

      const expensesInSelectedDate =
        tempMonthExpenses[`${parseInt(date.slice(9))}`];

      expensesInSelectedDate.forEach((ele) => {
        if (ele.total === expense && ele.category === category) {
          const index = expensesInSelectedDate.indexOf(ele);
          expensesInSelectedDate.splice(index, 1);
          console.log("DELETING");
          return;
        }
      });

      console.log("date", `${parseInt(date.slice(9))}`);
      console.log(tempMonthExpenses);

      summary[currDate.getFullYear()][currDate.getMonth() + 1] =
        tempMonthExpenses;

      await updateDoc(docRef, {
        summary: summary,
      });

      getExpensesFromFirestore();

      fetchExpenses(userEmail);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <Pressable
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("Expenses Screen");
          }}
        >
          <Icon name="chevron-left" size={20} color={"#38434A"} />
        </Pressable>
        <Text style={styles.header}> {category} Expenses</Text>
      </View>
      <FlatList
        data={expensesData}
        keyExtractor={(item) => {
          return expensesData.indexOf(item);
        }}
        renderItem={renderFlatListItem}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    marginHorizontal: "auto",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
    marginVertical: 10,
    alignSelf: "center",
    color: "#38434A",
  },
  flatList: {
    // marginTop: 30,
    alignSelf: "center",
    width: "90%",
    padding: 10,
  },
  flatListCell: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical:8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "gray",
  },
  flatListLeftPart: {
    flexDirection: "row",
    alignItems: "center",
    height: "80%",
    flex: 1,
  },
  flatListDate: {
    fontSize: 18,
    color: "#8B999C",
    fontFamily: "Montserrat_600SemiBold",
  },
  flatListExpensesView: {
    display: "flex",
    flexDirection: "column",
  },
  flatListExpenses: {
    fontSize: 20,
    margin: 2,
    fontFamily: "Montserrat_700Bold",
    color: "#62D2B3",
  },
});

export default ExpensesDetailScreen;
