import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import { Divider } from "@rneui/themed";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

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
  const [plusVisible, setPlusVisible] = useState(true);

  const [expensesData, setExpensesData] = useState([]);

  const [openInputExpensesOptions, setOpenInputExpensesOptions] =
    useState(false);

  const sheetRef = useRef(null);
  const snapPoints = ["25%"];

  useEffect(() => {
    setExpensesData([
      {
        id: "1",
        category: "Groceries",
        imagePath: require(`../assets/expenses/groceries-icon.png`),
        expense: "150.99",
      },
      {
        id: "2",
        category: "Food",
        imagePath: require(`../assets/expenses/food-icon.png`),
        expense: "120.00",
      },
      {
        id: "3",
        category: "Fuel",
        imagePath: require(`../assets/expenses/fuel-icon.png`),
        expense: "60.44",
      },
      {
        id: "4",
        category: "Housing",
        imagePath: require(`../assets/expenses/housing-icon.png`),
        expense: "1200.00",
      },
    ]);
  }, []);

  useEffect(() => {
    setPlusVisible(true);
  }, [openInputExpensesOptions]);

  // render the expenses flatList
  const renderFlatListItem = ({ item: { category, imagePath, expense } }) => (
    <Pressable>
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
          ${expense}
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
    navigation.navigate(screenName);
    setOpenInputExpensesOptions(false);
    setPlusVisible(true);
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

            {plusVisible && (
              <Pressable
                style={styles.plus}
                onPress={() => {
                  // Open the bottom sheet
                  setOpenInputExpensesOptions(true);
                }}
              >
                <Icon name="plus" size={25} />
              </Pressable>
            )}
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
              $300.56
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
                $1799.45 remaining
              </Text>
            </View>

            <Progress.Bar
              progress={0.3}
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
            <Pressable style={styles.summaryEditBudgetView}>
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

          <FlatList
            data={expensesData}
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
    marginTop: 50,
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
