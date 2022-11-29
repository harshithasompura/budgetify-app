import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import * as Progress from "react-native-progress";
import { Divider } from "@rneui/themed";
import DialogInput from "react-native-dialog-input";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import useExpenses from "../redux/hook/useExpenses";

// Firebase
import { auth, db } from "../../FirebaseApp";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Vector Icons
import Icon from "react-native-vector-icons/FontAwesome";

const ExpensesScreen = ({ navigation }) => {
  // redux state
  const {
    // state for budget
    budget,

    // state for expenses data
    expensesData,

    // state for fetching data
    fetchExpenses,
  } = useExpenses();

  // useState for Current User
  const [userEmail, setUserEmail] = useState("testingUID");

  // useState for Expenses Data
  const [totalExpenses, setTotalExpenses] = useState(0);

  // useState for Budget
  const [budgetPopUp, setBudgetPopUp] = useState(false);

  // useState for Open Bottom Sheet
  const [openInputExpensesOptions, setOpenInputExpensesOptions] =
    useState(false);

  // Bottom Sheet Setting
  const sheetRef = useRef(null);
  const snapPoints = ["25%"];

  // Get the current user
  useEffect(() => {
    const unsubscribeOnAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        console.log(userEmail);
      } else {
        console.log("no signed-in user");
      }
    });
  }, []);

  // Get the expenses of each categories and the monthly budget from Firestore
  useEffect(() => {
    if (!userEmail) return;
    fetchExpenses(userEmail);
  }, [userEmail, budget]);

  // Get the total expense
  useEffect(() => {
    const totalExpensesNumber = expensesData.reduce(
      (total, currElement) => total + currElement.expense,
      0
    );
    setTotalExpenses(totalExpensesNumber);
  }, [expensesData]);

  //Edit Budget
  const editBudget = (value) => {
    value = parseFloat(value).toFixed(2);
    setBudgetPopUp(false);

    saveBudgetToFirestore(parseFloat(value));

    fetchExpenses(userEmail);
  };

  const saveBudgetToFirestore = async (value) => {
    const userRef = doc(db, "users", userEmail, "expenses", userEmail);
    await updateDoc(userRef, {
      budget: value,
    });
  };

  // render the expenses flatList
  const renderFlatListItem = ({ item: { category, imagePath, expense } }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("Expense Detail", {
          category: category,
          userEmail: userEmail,
        })
      }
    >
      <View style={styles.flatListRow}>
        <View style={styles.flatListCategoryView}>
          <Image style={styles.flatListCategoryIcon} source={imagePath} />
          <Text style={styles.flatListCategoryText}>{category}</Text>
        </View>
        <Text
          style={[
            styles.flatListExpense,
            {
              color: openInputExpensesOptions
                ? "rgba(202, 170, 250,.6)"
                : "rgb(56,69,72)",
            },
          ]}
        >
          ${expense.toFixed(2)}
        </Text>
      </View>
      <Divider style={styles.divider} />
    </Pressable>
  );

  // Bottom Sheet FlatList Setting
  const bottomSheetArray = [
    {
      id: 1,
      title: "Take Photo",
      screenName: "Camera",
      icon: <Icon name="camera" size={20} style={{ marginLeft: 20 }} />,
    },
    {
      id: 2,
      title: "Fill in the Form",
      screenName: "Add Expense",
      icon: <Icon name="pencil" size={25} style={{ marginLeft: 20 }} />,
    },
  ];

  const bottomSheetOptionSelected = (screenName) => {
    // navigate to corresponding screen
    navigation.navigate(screenName, { userEmail: userEmail });
    setOpenInputExpensesOptions(false);
    return;
  };

  // render the bottom sheet flatList
  const renderBottomSheetItem = ({ item: { title, screenName, icon } }) => (
    <Pressable onPress={() => bottomSheetOptionSelected(screenName)}>
      <Divider style={{ marginBottom: 20 }} />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        {icon}
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Montserrat_400Regular",
            marginLeft: 20,
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );

  // ------------------------ View Template -----------------------
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: openInputExpensesOptions
              ? "rgba(0,0,0,.6)"
              : "white",
          },
        ]}
      >
        <View style={styles.screenHeadingView}>
          <Text
            style={[
              styles.screenHeading,
              { fontFamily: "Montserrat_600SemiBold" },
            ]}
          >
            Expenses
          </Text>

          <Pressable
            style={styles.plus}
            onPress={() => {
              // Open the bottom sheet
              setOpenInputExpensesOptions(true);
            }}
          >
            <Icon name="plus" size={22} />
          </Pressable>
        </View>

        <View
          style={[
            styles.summary,
            {
              backgroundColor: openInputExpensesOptions
                ? "rgba(0,0,0,.6)"
                : "#62D2B3",
            },
          ]}
        >
          <Text
            style={[
              styles.summaryTitle,
              {
                color: openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "#fef",
              },
            ]}
          >
            Your expenses
          </Text>
          <Text
            style={[
              styles.summaryExpense,
              {
                color: openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "white",
              },
            ]}
          >
            ${totalExpenses.toFixed(2)}
          </Text>

          <View style={styles.summaryRemainingView}>
            <Text
              style={[
                styles.summaryRemaining,
                {
                  color: openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "#fef",
                },
              ]}
            >
              Budget
            </Text>
            <Text
              style={[
                styles.summaryRemaining,
                {
                  color: openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "#fef",
                },
              ]}
            >
              ${`${(budget - parseFloat(totalExpenses)).toFixed(2)}`} remaining
            </Text>
          </View>

          <Progress.Bar
            progress={(budget - parseFloat(totalExpenses)) / budget}
            width={null}
            height={8}
            color={openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "#B17BFF"}
            unfilledColor={
              openInputExpensesOptions ? "rgba(0, 0, 0,.6)" : "#fff"
            }
            borderRadius={20}
            style={styles.summaryProgressBar}
          />
          <Pressable
            style={styles.summaryEditBudgetView}
            onPress={() => setBudgetPopUp(true)}
          >
            <Icon
              name="pencil"
              size={15}
              color={
                openInputExpensesOptions ? "rgba(202, 170, 250,.6)" : "#B17BFF"
              }
            />
            <Text
              style={[
                styles.summaryEditBudget,
                {
                  color: openInputExpensesOptions
                    ? "rgba(202, 170, 250,.6)"
                    : "#B17BFF",
                },
              ]}
            >
              Edit Budget
            </Text>
          </Pressable>
        </View>

        <DialogInput
          isDialogVisible={budgetPopUp}
          title={"Enter Monthly Budget"}
          message={`Your current budget is $${parseFloat(budget).toFixed(2)}`}
          hintInput={"enter your budget here"}
          submitInput={(value) => {
            if (!value) {
              setBudgetPopUp(false);
              return;
            }
            editBudget(value);
          }}
          closeDialog={() => setBudgetPopUp(false)}
          modalStyle={{ backgroundColor: "rgba(0,0,0,.6)" }}
          dialogStyle={{
            backgroundColor: "#dedfde",
            paddingLeft: 15,
            paddingRight: 15,
          }}
          textInputProps={{ keyboardType: "numeric" }}
        />

        <FlatList
          data={expensesData.filter((element) => element.expense !== 0)}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderFlatListItem}
          style={styles.flatList}
        />
      </View>

      {openInputExpensesOptions ? (
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => {
            setOpenInputExpensesOptions(false);
          }}
        >
          <BottomSheetFlatList
            data={bottomSheetArray}
            keyExtractor={(item) => item.id}
            renderItem={renderBottomSheetItem}
          />
        </BottomSheet>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  screenHeadingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenHeading: {
    fontSize: 22,
    marginVertical: 30,
    marginHorizontal: 30,
  },
  plus: {
    alignSelf: "flex-end",
    marginVertical: 30,
    marginHorizontal: 30,
  },
  summary: {
    alignSelf: "center",
    borderRadius: 20,
    width: "85%",
    padding: 8,
    fontSize: 16,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  summaryTitle: {
    marginLeft: 15,
    marginTop: 15,
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
    marginBottom: 8,
  },
  summaryExpense: {
    marginLeft: 15,
    marginVertical: 8,
    fontFamily: "Montserrat_700Bold",
    fontSize: 28,
  },
  summaryRemainingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  summaryRemaining: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  summaryProgressBar: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderColor: "gray",
  },
  summaryEditBudgetView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  summaryEditBudget: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Montserrat_600SemiBold",
    marginLeft: 5,
  },
  flatList: {
    marginTop: 44,
    alignSelf: "center",
    width: "80%",
  },
  flatListRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatListCategoryView: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListCategoryIcon: {
    height: 18,
    width: 18,
  },
  flatListCategoryText: {
    fontSize: 16,
    fontWeight: "300",
    fontFamily: "Montserrat_400Regular",
    marginLeft: 20,
  },
  flatListExpense: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ExpensesScreen;
