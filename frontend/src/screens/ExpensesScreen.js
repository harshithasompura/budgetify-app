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

// Importing fonts
import {
  useFonts,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";
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
                : "#B17BFF",
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
            fontSize: 30,
            fontFamily: "IBMPlexMono_500Medium",
            marginLeft: 20,
          }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );

  let [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
  });
  if (!fontsLoaded) {
    return <Text>Fonts are loading...</Text>;
  } else {
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
                { fontFamily: "IBMPlexMono_500Medium" },
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
              <Icon name="plus" size={25} />
            </Pressable>
          </View>

          <View
            style={[
              styles.summary,
              {
                backgroundColor: openInputExpensesOptions
                  ? "rgba(0,0,0,.6)"
                  : "black",
              },
            ]}
          >
            <Text
              style={[
                styles.summaryTitle,
                {
                  color: openInputExpensesOptions
                    ? "rgba(224, 242, 119,.6)"
                    : "#C5F277",
                },
              ]}
            >
              Your expenses
            </Text>
            <Text
              style={[
                styles.summaryExpense,
                {
                  color: openInputExpensesOptions
                    ? "rgba(224, 242, 119,.6)"
                    : "#C5F277",
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
                    color: openInputExpensesOptions
                      ? "rgba(224, 242, 119,.6)"
                      : "#C5F277",
                  },
                ]}
              >
                Your monthly budget
              </Text>
              <Text
                style={[
                  styles.summaryRemaining,
                  {
                    color: openInputExpensesOptions
                      ? "rgba(224, 242, 119,.6)"
                      : "#C5F277",
                  },
                ]}
              >
                ${`${(budget - parseFloat(totalExpenses)).toFixed(2)}`}{" "}
                remaining
              </Text>
            </View>

            <Progress.Bar
              progress={(budget - parseFloat(totalExpenses)) / budget}
              width={null}
              height={8}
              color={
                openInputExpensesOptions ? "rgba(202, 170, 250,.6)" : "#B17BFF"
              }
              unfilledColor={
                openInputExpensesOptions ? "rgba(215, 217, 208,.6)" : "#fff"
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
                  openInputExpensesOptions
                    ? "rgba(202, 170, 250,.6)"
                    : "#B17BFF"
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
  }
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
    fontSize: 30,
    fontWeight: "400",
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
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    width: "85%",
  },
  summaryTitle: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 20,
  },
  summaryExpense: {
    marginLeft: 15,
    marginTop: 10,
    fontFamily: "IBMPlexMono_500Medium",
    fontSize: 36,
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
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  summaryEditBudget: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 5,
  },
  flatList: {
    marginTop: 30,
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
    height: 25,
    width: 25,
  },
  flatListCategoryText: {
    fontSize: 25,
    fontWeight: "300",
    marginLeft: 20,
  },
  flatListExpense: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B17BFF",
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ExpensesScreen;
