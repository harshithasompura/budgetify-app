import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

// Firebase
import { db } from "../../FirebaseApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Importing fonts
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";

const ExpensesDetailScreen = ({ route }) => {
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

      const temp = []
      Object.entries(tempMonthExpenses)
        .forEach((item) => {
          item[1]
            .forEach(innerItem => {
              if (innerItem.category === category)
                temp.push(innerItem);
          })
        })      
      setExpensesData(temp);
      
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const renderFlatListItem = ({ item }) => {
    return (
      <Pressable style={styles.flatListCell}>
        <Text style={styles.flatListDate}>{item["date"]}</Text>
        <Text>{item["total"]}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category}</Text>

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
    paddingVertical: 10,
  },
  header: {
    fontSize: 25,
    fontFamily: "IBMPlexMono_400Regular",
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  flatList: {
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
  },
  flatListCell: {
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "red",
  },
  flatListDate: {
    fontSize: 30,
    fontFamily: "IBMPlexMono_500Medium",
  },
  flatListExpensesView: {
    display: "flex",
    flexDirection: "column",
  },
  flatListExpenses: {
    fontSize: 15,
  },
});

export default ExpensesDetailScreen;
