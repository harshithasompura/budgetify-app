import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    const { date, total } = item;
    const expense = parseFloat(total);

    return (
      <View style={styles.flatListCell}>
        <Pressable style={styles.flatListLeftPart} onPress={() => {}}>
          <Text style={styles.flatListDate}>Date: {date}</Text>
          <Text style={styles.flatListExpenses}>$ {expense}</Text>
        </Pressable>

        <Button
          title="Delete"
          type="clear"
          onPress={() => deleteExpense(date, expense)}
        />
      </View>
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
    <View style={styles.container}>
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
    </View>
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
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
    padding: 10,
  },
  flatListCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "gray",
  },
  flatListLeftPart: {},
  flatListDate: {
    fontSize: 20,
    margin: 4,
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
