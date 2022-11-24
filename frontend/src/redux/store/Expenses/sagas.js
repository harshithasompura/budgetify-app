import { call, put, takeLatest } from "redux-saga/effects";
import actions from "./actions";
import { ExpensesActionType } from "./types";

// firebase
import { db } from "../../../../FirebaseApp";
import { doc, getDoc } from "firebase/firestore";

// Get the sum of the expense in current month
const calculateMonthExpense = (expenseOfCategory) => {
  if (!expenseOfCategory) return 0;
  const date = new Date();
  if (expenseOfCategory[date.getFullYear()]) {
    if (expenseOfCategory[date.getFullYear()][date.getMonth() + 1]) {
      const tempMonthExpense =
        expenseOfCategory[date.getFullYear()][date.getMonth() + 1];
      let total = 0;

      for (const [key, value] of Object.entries(tempMonthExpense)) {
        const dateExpense = value.reduce((acc, item) => acc + item, 0);
        total = total + dateExpense;
      }
      return total;
    }
  }
  return 0;
};

export function* fetchExpenses({ payload }) {
  try {
    console.log("call");
    const { email } = payload;
    const docRef = doc(db, "users", email);
    console.log("payload", payload);
    const docSnap = yield getDoc(docRef);

    if (!docSnap.exists()) return;

    const { budget, allExpenses } = docSnap.data();

    if (budget) {
      yield put(actions.setBudget(budget));
      console.log("BudGet", budget);
    }

    if (!allExpenses) return;

    yield put(
      actions.setGroceriesExpense(
        calculateMonthExpense(allExpenses["Groceries"])
      )
    );
    console.log("Groceries", calculateMonthExpense(allExpenses["Groceries"]));

    yield put(
      actions.setFoodExpense(calculateMonthExpense(allExpenses["Food"]))
    );
    console.log("Food", calculateMonthExpense(allExpenses["Food"]));

    yield put(
      actions.setFuelExpense(calculateMonthExpense(allExpenses["Fuel"]))
    );
    console.log("Fuel", calculateMonthExpense(allExpenses["Fuel"]));

    yield put(
      actions.setTransportationExpense(
        calculateMonthExpense(allExpenses["Transportation"])
      )
    );
    console.log(
      "Transportation",
      calculateMonthExpense(allExpenses["Transportation"])
    );

    yield put(
      actions.setEntertainmentExpense(
        calculateMonthExpense(allExpenses["Entertainment"])
      )
    );
    console.log(
      "Entertainment",
      calculateMonthExpense(allExpenses["Entertainment"])
    );

    yield put(
      actions.setHousingExpense(calculateMonthExpense(allExpenses["Housing"]))
    );
    console.log("Housing", calculateMonthExpense(allExpenses["Housing"]));

    yield put(
      actions.setClothingExpense(calculateMonthExpense(allExpenses["Clothing"]))
    );
    console.log("Clothing", calculateMonthExpense(allExpenses["Clothing"]));

    yield put(
      actions.setHealthExpense(calculateMonthExpense(allExpenses["Health"]))
    );
    console.log("Health", calculateMonthExpense(allExpenses["Health"]));

    yield put(
      actions.setOthersExpense(calculateMonthExpense(allExpenses["Others"]))
    );
    console.log("Others", calculateMonthExpense(allExpenses["Others"]));

    yield put(
      actions.setExpensesData([
        {
          id: "0",
          category: "Groceries",
          imagePath: require(`../../../../assets/expenses/groceries-icon.png`),
          expense: calculateMonthExpense(allExpenses["Groceries"]),
        },
        {
          id: "1",
          category: "Food",
          imagePath: require(`../../../../assets/expenses/food-icon.png`),
          expense: calculateMonthExpense(allExpenses["Food"]),
        },
        {
          id: "2",
          category: "Fuel",
          imagePath: require(`../../../../assets/expenses/fuel-icon.png`),
          expense: calculateMonthExpense(allExpenses["Fuel"]),
        },
        {
          id: "3",
          category: "Transportation",
          imagePath: require(`../../../../assets/expenses/transportation-icon.png`),
          expense: calculateMonthExpense(allExpenses["Transportation"]),
        },
        {
          id: "4",
          category: "Entertainment",
          imagePath: require(`../../../../assets/expenses/entertainment-icon.png`),
          expense: calculateMonthExpense(allExpenses["Entertainment"]),
        },
        {
          id: "5",
          category: "Housing",
          imagePath: require(`../../../../assets/expenses/housing-icon.png`),
          expense: calculateMonthExpense(allExpenses["Housing"]),
        },
        {
          id: "6",
          category: "Clothing",
          imagePath: require(`../../../../assets/expenses/clothing-icon.png`),
          expense: calculateMonthExpense(allExpenses["Clothing"]),
        },
        {
          id: "7",
          category: "Health",
          imagePath: require(`../../../../assets/expenses/health-icon.png`),
          expense: calculateMonthExpense(allExpenses["Health"]),
        },
        {
          id: "8",
          category: "Others",
          imagePath: require(`../../../../assets/expenses/others-icon.png`),
          expense: calculateMonthExpense(allExpenses["Others"]),
        },
      ])
    );
  } catch (err) {
    console.log(err);
  }
}

const sagas = [takeLatest(ExpensesActionType.FETCH_EXPENSES, fetchExpenses)];

export default sagas;
