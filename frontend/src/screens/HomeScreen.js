// Home Screen of our app - Tabs Go here!
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import expensesSelectors from "../redux/store/Expenses/selectors";
import useExpenses from "../redux/hook/useExpenses";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FirebaseApp";
import { db } from "../../FirebaseApp";
import { doc, getDoc } from "firebase/firestore";
import * as Progress from "react-native-progress";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import AlternateHomeScreen from "./AlternateHomeScreen";
import { useIsFocused } from "@react-navigation/native";
// import { get } from "immer/dist/internal";

const HomeScreen = ({ navigation }) => {
  const {
    // state for fetching data
    fetchExpenses,
  } = useExpenses();

  const [loggedUser, setLoggedUser] = useState("");
  const isFocused = useIsFocused();
  useEffect(() => {
    setShowEmptyExpense(checkPieChart(pieChartData));
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
        setLoggedUser(user.email);
        fetchExpenses(user.email);
        setShowEmptyExpense(checkPieChart(pieChartData));
        // setShowEmptyExpense(checkPieChart(pieChartData));
      } else {
        console.log("no signed-in user");
      }
    });
    getExpensesFromFB();
    return unsubscribeOnAuth;
  }, [isFocused]);

  const getExpensesFromFB = async () => {
    fetchExpenses(loggedUser.email);
    setShowEmptyExpense(checkPieChart(pieChartData));
    const docRef = doc(db, "users", loggedUser, "expenses", loggedUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // setExpenseFromFB(docSnap.data().summary);
      console.log(docSnap.data().summary);
      let checkIfExists = Object.keys(docSnap.data().summary).length === 0;

      if (checkIfExists) {
        console.log(`${checkIfExists}`);
        setShowEmptyExpense(true);
      } else {
        console.log("docSnap", docSnap.data().summary);
        setShowEmptyExpense(false);
        console.log(`${!checkIfExists}`);
      }
      // console.log();
    }
    // setShowEmptyExpense(checkPieChart(pieChartData));
  };

  const [showEmptyExpense, setShowEmptyExpense] = useState(false);
  const width = Dimensions.get("window").width;
  const height = 220;
  const progressChartData = [0.4, 0.6, 0.8];

  const groceryExpensesFromFirebase = useSelector(
    expensesSelectors.getGroceriesExpense
  );
  const foodExpensesFromFirebase = useSelector(
    expensesSelectors.getFoodExpense
  );
  const fuelExpensesFromFirebase = useSelector(
    expensesSelectors.getFuelExpense
  );
  const transportExpensesFromFirebase = useSelector(
    expensesSelectors.getTransportationExpense
  );
  const entertainExpensesFromFirebase = useSelector(
    expensesSelectors.getEntertainmentExpense
  );
  const housingExpensesFromFirebase = useSelector(
    expensesSelectors.getHousingExpense
  );
  const clothesExpensesFromFirebase = useSelector(
    expensesSelectors.getClothingExpense
  );
  const otherExpensesFromFirebase = useSelector(
    expensesSelectors.getOthersExpense
  );

  const allExpenseFromFirebase = useSelector(expensesSelectors.getExpensesData);

  const budget = useSelector(expensesSelectors.getBudget);

  const pieChartData = [
    {
      name: "Groceries",
      expense: groceryExpensesFromFirebase,
      color: "#5844FB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Food",
      expense: foodExpensesFromFirebase,
      color: "#FBE901",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Fuel",
      expense: fuelExpensesFromFirebase,
      color: "#86D3C6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Transportation",
      expense: transportExpensesFromFirebase,
      color: "#EE4D46",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Entertainment",
      expense: entertainExpensesFromFirebase,
      color: "#FD8931",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Housing",
      expense: housingExpensesFromFirebase,
      color: "#F9C0FF",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Clothes",
      expense: clothesExpensesFromFirebase,
      color: "#6FCE25",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Others",
      expense: otherExpensesFromFirebase,
      color: "#202022",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    paddingRight: 20,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const checkPieChart = (pieChartData) => {
    const dataLength = pieChartData.length;
    // console.log(dataLength)
    let emptyCount = 0;
    // const emptyCount =
    for (const item in pieChartData) {
      // console.log(pieChartData[data])
      if (pieChartData[item].expense === 0) {
        // console.log("Empty");
        emptyCount++;
      } else {
        console.log("some data");
        return false;
      }
    }
    if (emptyCount === dataLength) {
      console.log("All empty!");
      return true;
    }
    // setShowEmptyExpense(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[styles.screenHeading, { fontFamily: "Montserrat_600SemiBold" }]}
      >
        Analytics
      </Text>
      {showEmptyExpense ? (
        <AlternateHomeScreen navigation={navigation} />
      ) : (
        <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
          {/* Analytics Container */}
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={width * 1.75}
              height={300}
              chartConfig={chartConfig}
              accessor={"expense"}
              backgroundColor={"transparent"}
              paddingLeft={"20"}
              hasLegend={false}
            />
            {/* <ProgressChart
            data={progressChartData}
            width={width}
            height={height}
            chartConfig={chartConfig}
           
          /> */}
          </View>
          {/* Detailed Overview */}
          <ScrollView style={styles.expenseContainer}>
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  marginVertical: 10,
                }}
              >
                Total Expenses
              </Text>
              <Text>{}</Text>
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Groceries
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${groceryExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={groceryExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#5844FB"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Food
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${foodExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={foodExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#FBE901"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Fuel
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${fuelExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={fuelExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#86D3C6"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Transportation
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${transportExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={transportExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#EE4D46"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Entertainment
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${entertainExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={entertainExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#FD8931"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Housing
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${housingExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={housingExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#F9C0FF"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Clothes
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${clothesExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={clothesExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#6FCE25"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
            <View>
              {/* Individial Progress */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_400Regular",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  Others
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 15,
                    marginVertical: 8,
                  }}
                >
                  ${otherExpensesFromFirebase}
                </Text>
              </View>
              <Progress.Bar
                progress={otherExpensesFromFirebase / budget}
                width={null}
                height={8}
                color={"#202022"}
                unfilledColor={"#fff"}
                borderRadius={20}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  screenHeading: {
    fontSize: 22,
    marginVertical: 20,
  },
  pieChartContainer: {
    marginHorizontal: 20,
    margin: 20,
    width: "100%",
  },
  expenseContainer: {
    backgroundColor: "white",
    height: "auto",
    width: "100%",
    padding: 20,
    borderColor: "black",
    borderLeftWidth: 2,
    borderTopWidth: 1,
    borderRightWidth: 2,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
});

export default HomeScreen;
