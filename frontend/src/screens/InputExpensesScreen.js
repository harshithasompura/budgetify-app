import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Divider } from "@rneui/themed";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import useExpenses from '../redux/hook/useExpenses'

// Firebase
import { db } from "../../FirebaseApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Firebase
import { db } from "../FirebaseApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Importing fonts
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from "@expo-google-fonts/ibm-plex-mono";

const InputExpensesScreen = ({ route }) => {
  // url parameters
  const { userEmail } = route.params;


  // redux state
  const { fetchExpenses } = useExpenses();

  // useState for Expenses
  const [expenses, setExpenses] = useState({});

  // useState for Calculator
  const [showCalculator, setShowCalculator] = useState(true);
  const [curValue, setCurValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [preValue, setPreValue] = useState(null);

  // useState for DatePicker
  const [date, setDate] = useState(new Date());
  const [showCalender, setShowCalender] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);

  // useState for Category
  const [category, setCategory] = useState(null);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

  const sheetRef = useRef(null);
  const snapPoints = ["70%"];

  useEffect(() => {
    setShowCalculator(true);
  }, [showCategoriesMenu]);

  // Fetch all the expenses from firestore
  useEffect(() => {
    getAllExpensesFromFirestore();
  }, []);

  const getAllExpensesFromFirestore = async () => {
    const docRef = doc(db,"expenses", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { allExpenses } = docSnap.data();

      if (allExpenses) {
        setExpenses(allExpenses);
      } else {
        console.log("No data in allExpenses");
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  // Open DatePicker
  const openDatePicker = () => {
    setShowCalender(true);
    setShowCalculator(false);
  };

  // Run when the Confirm Button of DatePicker is pressed
  const confirmDatePicker = () => {
    setShowCalender(false);
    setShowCalculator(true);
    setIsDateSelected(true);
  };

  // Run when the date of DatePicker is pressed
  const datePickerSelect = (event, selectedDate) => {
    setDate(selectedDate);
  };

  // Run when button of Calculator is pressed
  const calButtonPressed = (type, value = "") => {
    if (type === "number") {
      if ((curValue === "0") & (value !== ".")) {
        setCurValue(value);
      } else if (curValue.includes(".")) {
        if (value === ".") {
          return;
        }
        if (curValue.split(".")[1].length >= 2) {
          return;
        } else {
          setCurValue(`${curValue}${value}`);
        }
      } else {
        setCurValue(`${curValue}${value}`);
      }
    }
    if (type === "operator") {
      setCurValue("0");
      setPreValue(curValue);
      setOperator(value);
    }
    if (type === "clear") {
      setCurValue("0");
      setPreValue(null);
      setOperator(null);
    }
    if (type === "del") {
      if (curValue.length === 1) {
        setCurValue("0");
      } else {
        setCurValue(curValue.slice(0, -1));
      }
    }
    if (type === "confirm") {
      closeCalculator();
    }
    if (type === "equal") {
      const currentNumber = parseFloat(curValue);
      const previousNumber = parseFloat(preValue);

      switch (operator) {
        case "+": {
          setCurValue(`${(previousNumber + currentNumber).toFixed(2)}`);
          setPreValue(null);
          setOperator(null);
          return;
        }
        case "-": {
          if (previousNumber - currentNumber < 0) {
            setCurValue("0.00");
          } else {
            setCurValue(`${(previousNumber - currentNumber).toFixed(2)}`);
          }
          setPreValue(null);
          setOperator(null);
          return;
        }
        case "x": {
          setCurValue(`${(previousNumber * currentNumber).toFixed(2)}`);
          setPreValue(null);
          setOperator(null);
          return;
        }
        case "/": {
          setCurValue(`${(previousNumber / currentNumber).toFixed(2)}`);
          setPreValue(null);
          setOperator(null);
          return;
        }
        default: {
          setCurValue(`${currentNumber.toFixed(2)}`);
          return;
        }
      }
    }
  };

  // Run when Check Button at the top is pressed
  const checkPressed = () => {
    if (isDateSelected === false) {
      Alert.alert("Please select a date");
      return;
    }
    if (category === null) {
      Alert.alert("Please select a category");
      return;
    }
    if (
      curValue === "0" ||
      curValue === "0." ||
      curValue === "0.0" ||
      curValue === "0.00"
    ) {
      Alert.alert("Please enter a number");
      return;
    }

    let temp = "";
    if (!curValue.includes(".")) {
      temp = curValue + ".00";
    } else if (curValue.endsWith(".")) {
      temp = curValue + "00";
    } else if (curValue.split(".")[1].length === 1) {
      temp = curValue + "0";
    } else {
      temp = curValue;
    }

    saveExpenseToFireStore(temp);

    setCurValue(temp);
    setOperator(null);

    // fetchExpenses(userEmail)

    Alert.alert("Expense Saved", "", [
      { text: "OK", onPress: () => fetchExpenses(userEmail) },
    ]);
  };

  // Save the expense to firestore
  const saveExpenseToFireStore = async (tempExpense) => {
    let tempAllExpenses = expenses;
    if (!tempAllExpenses[category]) {
      tempAllExpenses[category] = {};
    }
    if (!tempAllExpenses[category][`${date.getFullYear()}`]) {
      tempAllExpenses[category][`${date.getFullYear()}`] = {};
    }
    if (!tempAllExpenses[category][`${date.getFullYear()}`][`${date.getMonth() + 1}`]) {
      tempAllExpenses[category][`${date.getFullYear()}`][`${date.getMonth() + 1}`] = {};
    }
    if (!tempAllExpenses[category][`${date.getFullYear()}`][`${date.getMonth() + 1}`][`${date.getDate()}`]) {
      tempAllExpenses[category][`${date.getFullYear()}`][`${date.getMonth() + 1}`][`${date.getDate()}`] = [];
    }
    tempAllExpenses[category][`${date.getFullYear()}`][`${date.getMonth() + 1}`][`${date.getDate()}`].push(parseFloat(tempExpense));

    await updateDoc(doc(db, "expenses", userEmail), {
      allExpenses: tempAllExpenses,
    });

    setExpenses(tempAllExpenses);
  }

  // For Category Bottom Sheet
  const categoriesArray = [
    {
      id: "0",
      title: "Groceries",
      imagePath: require(`../../assets/expenses/groceries-icon.png`),
    },
    {
      id: "1",
      title: "Food",
      imagePath: require(`../../assets/expenses/food-icon.png`),
    },
    {
      id: "2",
      title: "Fuel",
      imagePath: require(`../../assets/expenses/fuel-icon.png`),
    },
    {
      id: "3",
      title: "Transportation",
      imagePath: require(`../../assets/expenses/transportation-icon.png`),
    },
    {
      id: "4",
      title: "Entertainment",
      imagePath: require(`../../assets/expenses/entertainment-icon.png`),
    },
    {
      id: "5",
      title: "Housing",
      imagePath: require(`../../assets/expenses/housing-icon.png`),
    },
    {
      id: "6",
      title: "Clothing",
      imagePath: require(`../../assets/expenses/clothing-icon.png`),
    },
    {
      id: "7",
      title: "Health",
      imagePath: require(`../../assets/expenses/health-icon.png`),
    },
    {
      id: "8",
      title: "Others",
      imagePath: require(`../../assets/expenses/others-icon.png`),
    },
  ];

  const renderFlatListItem = ({ item: { title, imagePath } }) => (
    <Pressable
      style={styles.flatListContentContainer}
      onPress={() => {
        setCategory(title);
        setShowCategoriesMenu(false);
      }}
    >
      <Divider style={styles.divider} />
      <View style={styles.flatListRow}>
        <View style={styles.flatListCategoryView}>
          <Image style={styles.flatListCategoryIcon} source={imagePath} />
          <Text style={styles.flatListCategoryText}>{title}</Text>
        </View>

        {category === title && (
          <Image
            style={{ height: 40, width: 40 }}
            source={require(`../../assets/expenses/check-icon.png`)}
          />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: showCategoriesMenu ? "rgba(0,0,0,.6)" : "white" },
      ]}
    >
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={styles.screenHeadingView}>
          <Text style={styles.screenHeading}>Add Expense</Text>
          <Pressable
            style={styles.checkIconView}
            onPress={showCategoriesMenu ? null : checkPressed}
          >
            <Image
              style={styles.checkIcon}
              source={require(`../../assets/expenses/check-icon.png`)}
            />
          </Pressable>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.amountView}>
            <Text
              style={[
                styles.amountText,
                {
                  color: showCategoriesMenu
                    ? "rgba(202, 170, 250,.6)"
                    : "#B17BFF",
                },
              ]}
            >
              ${curValue}
            </Text>
          </View>

          <Pressable
            style={[
              styles.contentContainer,
              isDateSelected ? { backgroundColor: "black" } : null,
            ]}
            onPress={showCategoriesMenu ? null : openDatePicker}
          >
            <Text
              style={[
                styles.contentText,
                isDateSelected ? { color: "#C5F277", fontSize: 30 } : null,
              ]}
            >
              {isDateSelected ? date.toLocaleDateString() : "Date of Expense"}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.contentContainer,
              category ? { backgroundColor: "black" } : null,
            ]}
            onPress={() => {
              setShowCategoriesMenu(true);
              setShowCalender(false);
              // setShowCalculator(true);
            }}
          >
            <Text
              style={[
                styles.contentText,
                category ? { color: "#C5F277", fontSize: 30 } : null,
              ]}
            >
              {category ? category : "Select Category"}
            </Text>
          </Pressable>

          {showCalculator && (
            <View>
              <View style={styles.calculator}>
                <View style={styles.calculatorRow}>
                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "7")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>7</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "8")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>8</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "9")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>9</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("operator", "+")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calculatorRow}>
                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "4")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>4</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "5")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>5</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "6")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>6</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("operator", "-")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>-</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calculatorRow}>
                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "1")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>1</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "2")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>2</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "3")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>3</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("operator", "x")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>x</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calculatorRow}>
                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", ".")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("number", "0")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>0</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("equal")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>=</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => calButtonPressed("operator", "/")}
                    style={styles.calculatorButton}
                  >
                    <Text style={styles.calculatorText}>/</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Pressable
                style={styles.clearTextView}
                onPress={() => calButtonPressed("clear")}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
          )}

          {showCalender && (
            <View style={styles.calenderContianer}>
              <Pressable
                style={styles.dateConfirmButton}
                onPress={confirmDatePicker}
              >
                <Text style={styles.dateConfirm}>Confirm</Text>
              </Pressable>

              <DateTimePicker
                value={date}
                mode="date"
                onChange={datePickerSelect}
                style={styles.calender}
                display="inline"
              />
            </View>
          )}

          {showCategoriesMenu ? (
            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={() => {
                setShowCategoriesMenu(false);
              }}
            >
              <BottomSheetFlatList
                data={categoriesArray}
                keyExtractor={(item) => item.id}
                renderItem={renderFlatListItem}
                style={styles.flatList}
              />
            </BottomSheet>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeadingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
  },
  screenHeading: {
    fontSize: 30,
    fontWeight: "200",
    fontFamily: "IBMPlexMono_400Regular",
  },
  checkIconView: {
    alignSelf: "flex-end",
  },
  checkIcon: {
    height: 35,
    width: 35,
  },
  amountView: {
    marginTop: 10,
    marginRight: 25,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  amountText: {
    fontSize: 45,
    fontFamily: "IBMPlexMono_500Medium",
    color: "#B17BFF",
  },
  contentContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
    height: 50,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 20,
    fontFamily: "IBMPlexMono_500Medium",
    letterSpacing: -1,
    color: "black",
  },
  calculator: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "black",
    marginTop: 15,
    width: "90%",
    alignSelf: "center",
  },
  calculatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calculatorButton: {
    justifyContent: "center",
    height: 100,
    width: "25%",
  },
  calculatorText: {
    alignSelf: "center",
    fontSize: 48,
    fontFamily: "IBMPlexMono_500Medium",
    color: "#1A191C75",
  },
  clearTextView: {
    marginTop: 10,
    marginRight: 25,
    alignSelf: "flex-end",
  },
  clearText: {
    fontSize: 45,
    fontFamily: "Arial",
    color: "black",
  },
  calenderContianer: {
    borderWidth: 1.2,
    borderRadius: 20,
    borderColor: "black",
    marginTop: 15,
    alignSelf: "center",
    width: "90%",
  },
  dateConfirmButton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#C5F277",
    paddingTop: 10,
    paddingBottom: 10,
  },
  dateConfirm: {
    alignSelf: "center",
    fontSize: 20,
  },
  calender: {
    height: 350,
  },
  flatList: {
    width: "100%",
    boderWidth: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  flatListContentContainer: {
    width: "80%",
    alignSelf: "center",
  },
  flatListRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatListCategoryView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  flatListCategoryIcon: {
    height: 25,
    width: 25,
  },
  flatListCategoryText: {
    fontSize: 25,
    fontWeight: "300",
    marginLeft: 20,
  },
  divider: {
    // marginTop: 20,
    marginBottom: 20,
  },
});

export default InputExpensesScreen;
