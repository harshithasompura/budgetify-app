import { StyleSheet, Text, SafeAreaView, Pressable } from "react-native";

// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

const AlternateHomeScreen = ({ navigation }) => {
  const goToExpenses = () => {
    console.log("Go to expenses button clicked");
    navigation.navigate("Expenses");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="search" color={"#B17BFF"} size={100} />
      <Text style={styles.screenHeading}>No Expenses Found</Text>
      <Pressable style={styles.expensesButton} onPress={goToExpenses}>
        <Text style={[styles.buttonText, { fontFamily: "Montserrat_700Bold" }]}>
          Add Expenses
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenHeading: {
    fontSize: 22,
    fontFamily: "Montserrat_400Regular",
    marginVertical: 20,
  },
  expensesButton: {
    backgroundColor: "#C5F277",
    //alignSelf: "stretch",
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#001c00",
    fontSize: 16,
  },
});

export default AlternateHomeScreen;
