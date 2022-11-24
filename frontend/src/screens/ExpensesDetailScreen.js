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

  const [expLookup, setExpLookup] = useState({});

  useEffect(() => {
    getExpensesFromFirestore();
  }, []);

  const getExpensesFromFirestore = async () => {
    const docRef = doc(db, "expenses", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { allExpenses } = docSnap.data();

      const date = new Date();
      const expLookup =
        allExpenses[category][date.getFullYear()][date.getMonth() + 1];
      // console.log(expLookup[3]);
      setExpLookup(expLookup);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const renderFlatListItem = ({ item }) => {
    return (
      <Pressable style={styles.flatListCell}>
        <Text style={styles.flatListDate}>{item[0]}</Text>
        <View style={styles.flatListExpensesView}>
          {expLookup[item[0]].map((item, index) => (
            <Text key={index} style={styles.flatListExpenses}>{`$${item}`}</Text>
          ))}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category}</Text>

      <FlatList
        // data={expLookup ? Object.entries(expLookup) : []}
        data={Object.entries(expLookup)}
        keyExtractor={(item) => {
          return item[0];
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
