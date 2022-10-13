import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";

const InputExpensesScreen = ({ navigation }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date());
  const [showCalender, setShowCalender] = useState(false);
  const [curValue, setCurValue] = useState("0");
  const [operator, setOperator] = useState(null);
  const [preValue, setPreValue] = useState(null);
  const [showSave, setShowSave] = useState(true);

  // Open Calculator
  const openCalculator = () => {
    setShowCalculator(true);
    setShowCalender(false);
    setShowSave(false);
  };

  // Close Calculator
  const closeCalculator = () => {
    setShowCalculator(false);
    setShowSave(true);
    
    if (!curValue.includes(".")) {
      setCurValue(curValue + ".00");
    }
    else if (curValue.endsWith(".")) {
      setCurValue(curValue + "00");
    }
    else if (curValue.split(".")[1].length === 1) {
      setCurValue(curValue + "0");
    }
  };

  // Open Calender
  const openDatePicker = () => {
    setShowCalender(true);
    setShowCalculator(false);
    setShowSave(false);
  };

  // Close Calender
  const closeDatePicker = () => {
    setShowCalender(false);
    setShowSave(true);
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

      console.log(operator);
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
        case "*": {
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
          return;
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Pressable style={styles.amountView} onPress={openCalculator}>
          <Text style={styles.amount}>{curValue}</Text>
        </Pressable>

        <Picker
          style={styles.picker}
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => {
            setCategory(itemValue);
          }}
        >
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Transportation" value="Transportation" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Clothing" value="Clothing" />
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Others" value="Others" />
        </Picker>

        <Pressable style={styles.dateTextView} onPress={openDatePicker}>
          <Text style={{ fontSize: 30, fontFamily: "IBMPlexMono_500Medium" }}>
            Date:
          </Text>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </Pressable>

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

        {showCalculator && (
          <View style={styles.calculator}>
            <View style={styles.calculatorRow}>
              <TouchableOpacity
                onPress={() => calButtonPressed("clear")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => calButtonPressed("confirm")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => calButtonPressed("del")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>DEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => calButtonPressed("operator", "/")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>/</Text>
              </TouchableOpacity>
            </View>

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
                onPress={() => calButtonPressed("operator", "*")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>*</Text>
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
                onPress={() => calButtonPressed("operator", "+")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calculatorRow}>
              <TouchableOpacity
                onPress={() => calButtonPressed("number", "0")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>0</Text>
              </TouchableOpacity>
              <Pressable style={styles.calculatorButton}>
                <Text style={styles.calculatorText}></Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => calButtonPressed("number", ".")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => calButtonPressed("equal")}
                style={styles.calculatorButton}
              >
                <Text style={styles.calculatorText}>=</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      {showSave && (
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            console.log(
              `Amount: ${curValue}, Date: ${date.toLocaleDateString()}, Category: ${category}`
            );
          }}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  amountView: {
    backgroundColor: "#fff",
    borderColor: "#72c963",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
    height: 60,
  },
  amount: {
    fontSize: 45,
    fontFamily: "IBMPlexMono_500Medium",
    alignSelf: "flex-end",
    marginRight: 5,
    color: "#4a963c",
  },
  picker: {
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 10,
    width: "100%",
    height: 195,
    borderColor: "#72c963",
    borderWidth: 2,
    borderRadius: 20,
  },
  dateTextView: {
    backgroundColor: "#fff",
    borderColor: "#72c963",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateText: {
    fontSize: 32,
    fontFamily: "IBMPlexMono_500Medium",
    alignSelf: "flex-end",
    marginRight: 5,
    color: "#4a963c",
  },
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
  calculator: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#72c963",
    marginTop: 10,
  },
  calculatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calculatorButton: {
    backgroundColor: "#6FD6B6",
    borderWidth: 1,
    borderColor: "#EDEDED",
    justifyContent: "center",
    height: 50,
    width: "25%",
  },
  calculatorText: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: "IBMPlexMono_500Medium",
    color: "#fff",
  },
  saveButton: {
    borderRadius: 10,
    backgroundColor: "#5eb54e",
    height: 40,
    width: 120,
    alignSelf: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
});

export default InputExpensesScreen;
