// Home Screen of our app - Tabs Go here!
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Dimensions
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import expensesSelectors from "./store/Expenses/selectors";
import {
  PieChart,
  ProgressChart
} from 'react-native-chart-kit';
const HomeScreen = () => {
  const width = Dimensions.get('window').width
  const height = 220
  const progressChartData = [0.4, 0.6, 0.8]

  const groceryExpensesFromFirebase = useSelector(expensesSelectors.getGroceriesExpense);;
  const foodExpensesFromFirebase = useSelector(expensesSelectors.getFoodExpense);
  const fuelExpensesFromFirebase = useSelector(expensesSelectors.getFuelExpense);
  const transportExpensesFromFirebase = useSelector(
    expensesSelectors.getTransportationExpense
  );
  const entertainExpensesFromFirebase = useSelector(
    expensesSelectors.getEntertainmentExpense
  );
  const housingExpensesFromFirebase = useSelector(expensesSelectors.getHousingExpense);
  const clothesExpensesFromFirebase = useSelector(expensesSelectors.getClothingExpense);
  const otherExpensesFromFirebase = useSelector(expensesSelectors.getOthersExpense);

  const pieChartData = [
    { name: 'Groceries', expense: groceryExpensesFromFirebase, color: '#5844FB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Food', expense: foodExpensesFromFirebase, color: '#FBE901', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Fuel', expense: fuelExpensesFromFirebase, color: '#86D3C6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Transportation', expense: transportExpensesFromFirebase, color: '#EE4D46', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Entertainment', expense: entertainExpensesFromFirebase, color: '#FD8931', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Housing', expense: housingExpensesFromFirebase, color: '#F9C0FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Clothes', expense: clothesExpensesFromFirebase, color: '#6FCE25', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Others', expense: otherExpensesFromFirebase, color: '#202022', legendFontColor: '#7F7F7F', legendFontSize: 15 }
  ]
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    paddingRight:20,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <SafeAreaView style={styles.container} >
      <Text style={styles.screenHeading}>Analytics</Text>
      <View>
        <PieChart
              data={pieChartData}
              width={width}
              height={300}
              chartConfig={chartConfig}
              accessor={"expense"}
              backgroundColor={"transparent"}
              paddingLeft={"20"}
            />
        {/* <ProgressChart
                data={progressChartData}
                width={width}
                height={height}
                chartConfig={chartConfig}
               
              /> */}
      </View>     
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical:20,
  },
  screenHeading: {
    textAlign:"center",
    fontSize: 30,
    fontWeight: "400",
  },
});

export default HomeScreen;
