import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// Importing fonts
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from "@expo-google-fonts/ibm-plex-mono";
// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

const InputExpensesScreen = ({ navigation }) => {
  // useState for Calculator
  const [showCalculator, setShowCalculator] = useState(true);
  const [curValue, setCurValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [preValue, setPreValue] = useState(null);

  // useState for Calender
  const [date, setDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [showCalender, setShowCalender] = useState(false);

  // useState for Category
  const [category, setCategory] = useState(null);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [dropDownItems, setDropDownItems] = useState([
    { label: "Food", value: "Food" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Transportation", value: "Transportation" },
    { label: "Groceries", value: "Groceries" },
    { label: "Clothing", value: "Clothing" },
    { label: "Housing", value: "Housing" },
    { label: "Health", value: "Health" },
    { label: "Donations", value: "Donations" },
    { label: "Others", value: "Others" },
  ]);

  // // Open Calculator
  // const openCalculator = () => {
  //   setShowCalculator(true);
  //   setShowCalender(false);
  //   setShowSave(false);
  //   setDisableDropDown(true);
  // };

  // // Close Calculator
  // const closeCalculator = () => {
  //   setShowCalculator(false);
  //   setShowSave(true);
  //   setDisableDropDown(false);

  //   if (!curValue.includes(".")) {
  //     setCurValue(curValue + ".00");
  //   } else if (curValue.endsWith(".")) {
  //     setCurValue(curValue + "00");
  //   } else if (curValue.split(".")[1].length === 1) {
  //     setCurValue(curValue + "0");
  //   }
  // };

  // Open Calender
  const openDatePicker = () => {
    setShowCalender(true);
    setShowCalculator(false);
    

    if (!curValue.includes(".")) {
      setCurValue(curValue + ".00");
    } else if (curValue.endsWith(".")) {
      setCurValue(curValue + "00");
    } else if (curValue.split(".")[1].length === 1) {
      setCurValue(curValue + "0");
    }
  };

  // Close Calender
  const closeDatePicker = () => {
    setShowCalender(false);
    setShowCalculator(true);
  };

  // Run when the confirm button of calender is pressed
  const datePickerSelect = (event, selectedDate) => {
    setDate(selectedDate);
  };

  // Run when button of calculator is pressed
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
          setCurValue(`${(currentNumber).toFixed(2)}`);
          return;
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={styles.screenHeadingView}>
          <Text style={styles.screenHeading}>Add Expense</Text>
          <Pressable
            style={styles.checkIconView}
            onPress={() => {
              if (isDateSelected === false) {
                Alert.alert("Please select a date");
                return;
              }
              if (category === null) {
                Alert.alert("Please select a category");
                return;
              }

              let temp = "";
              if (!curValue.includes(".")) {
                temp = curValue + ".00";
              } else if (curValue.endsWith(".")) {
                temp = curValue + "00";
              } else if (curValue.split(".")[1].length === 1) {
                temp = curValue + "0";
              }
              else {
                temp = curValue;
              }
              console.log(
                `Amount: ${temp}, Date: ${date.toLocaleDateString()}, Category: ${category}`
              );
              setCurValue(temp);
              setOperator(null);
            }}
          >
            <Image
              style={styles.checkIcon}
              source={require(`../assets/check-icon.png`)}
            />
          </Pressable>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.amountView}>
            <Text style={styles.amountText}>${curValue}</Text>
          </View>

          <Pressable style={styles.contentContainer}
            onPress={openDatePicker}>
            <Text style={styles.contentText}>
              {isDateSelected ? date.toLocaleDateString() : "Date of Expense"}
            </Text>
          </Pressable>

          <Pressable style={styles.contentContainer}>
            <Text style={styles.contentText}>{category ? category : "Select Category"}</Text>
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

          {/* <View>
            <Text style={[styles.contentRowText, { marginBottom: 5 }]}>
              Category:
            </Text>
            <DropDownPicker
              open={openDropDown}
              value={category}
              items={dropDownItems}
              setOpen={setOpenDropDown}
              setValue={setCategory}
              placeholder="Select the Category"
              textStyle={styles.dropDownText}
              labelStyle={styles.dropDownLabel}
              style={styles.dropDown}
              disabled={disableDropDown ? true : false}
            />
          </View> */}
        </View>

        {showCalender && (
          <View style={styles.calenderContianer}>
            <Pressable
              style={styles.dateConfirmButton}
              onPress={closeDatePicker}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#fff",
  },
  screenHeadingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "85%",
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
    marginRight: 40,
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
    width: "85%",
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
    width: "85%",
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
    marginRight: 40,
    alignSelf: "flex-end",
  },
  clearText: {
    fontSize: 45,
    fontFamily: "Arial",
    color: "black",
  },

  // dropDown: {
  //   backgroundColor: "#fff",
  //   alignSelf: "center",
  //   marginBottom: 10,
  //   width: "100%",
  //   borderColor: "#72c963",
  //   borderWidth: 2,
  //   borderRadius: 20,
  // },
  // dropDownLabel: {
  //   fontSize: 30,
  //   color: "#4a963c",
  //   fontFamily: "IBMPlexMono_500Medium",
  // },
  // dropDownText: {
  //   fontSize: 20,
  //   color: "black",
  //   fontFamily: "IBMPlexMono_500Medium",
  // },

  calenderContianer: {
    borderWidth: 7,
    borderRadius: 20,
    borderColor: "#72c963",
    marginBottom: 10,
  },
  dateConfirmButton: {
    backgroundColor: "#C5F277",
    paddingTop: 5,
    paddingBottom: 5,
  },
  dateConfirm: {
    alignSelf: "center",
    fontSize: 20,
  },
  calender: {
    height: 290,
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default InputExpensesScreen;
