import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

// Firebase
import { db } from "../../FirebaseApp";
import { doc, getDoc, updateDoc, query, orderBy } from "firebase/firestore";
// import { Icon } from "@rneui/base";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

const ExpensesDetailScreen = ({ route, navigation }) => {
  const { category, userEmail } = route.params;

  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    getExpensesFromFirestore();
    console.log(`Length of Array: ${expensesData.length}`);
    // console.log(`testing`,expensesData);
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

  const renderFlatListItem = ({ item }) => {
    return (
      <Pressable style={styles.flatListCell}>
        <Text style={styles.flatListDate}>Date: {item["date"]}</Text>
        <Text style={styles.flatListExpenses}>
          $ {parseFloat(item["total"])}
        </Text>
      </Pressable>
    );
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
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "gray",
  },
  flatListDate: {
    fontSize: 16,
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
    marginBottom: 20,
    color: "#62D2B3",
  },
});

export default ExpensesDetailScreen;
