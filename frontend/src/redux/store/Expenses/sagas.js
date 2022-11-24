import { call, put, takeLatest } from "redux-saga/effects";
import actions from "./actions";
import { ExpensesActionType } from "./types";

// firebase
import { db } from "../../../../FirebaseApp";
import { doc, getDoc } from "firebase/firestore";

// Get the sum of the expense in current month
const calculateMonthExpense = (summary, category) => {
  if (!summary) return 0;
  const date = new Date();
  if (summary[date.getFullYear()]) {
    if (summary[date.getFullYear()][date.getMonth() + 1]) {
      const tempMonthExpense =
        summary[date.getFullYear()][date.getMonth() + 1];
      let total = 0;

      for (const [key, value] of Object.entries(tempMonthExpense)) {
        const selectedCategory = value.filter(item => item["category"] === category)
        const dateExpense = selectedCategory.reduce((acc, item) => acc + item["total"], 0);
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
    const docRef = doc(db, "users", email, "expenses", email);
    console.log("payload", payload);
    const docSnap = yield getDoc(docRef);

    if (!docSnap.exists()) return;

    const { budget, summary } = docSnap.data();

    if (budget) {
      yield put(actions.setBudget(budget));
      console.log("BudGet", budget);
    }

    if (!summary) return;

    yield put(
        actions.setGroceriesExpense(
          calculateMonthExpense(summary, "Groceries")
        )
    )
    
    yield put(
      actions.setFoodExpense(calculateMonthExpense(summary, "Food"))
    );

    yield put(
      actions.setFuelExpense(calculateMonthExpense(summary, "Fuel"))
    );

    yield put(
      actions.setTransportationExpense(
        calculateMonthExpense(summary, "Transportation")
      )
    );

    yield put(
      actions.setEntertainmentExpense(
        calculateMonthExpense(summary, "Entertainment")
      )
    );

    yield put(
      actions.setHousingExpense(calculateMonthExpense(summary, "Housing"))
    );

    yield put(
      actions.setClothingExpense(calculateMonthExpense(summary, "Clothing"))
    );

    yield put(
      actions.setHealthExpense(calculateMonthExpense(summary, "Health"))
    );

    yield put(
      actions.setOthersExpense(calculateMonthExpense(summary, "Others"))
    );


    yield put(
      actions.setExpensesData([
        {
          id: "0",
          category: "Groceries",
          imagePath: require(`../../../../assets/expenses/groceries-icon.png`),
          expense: calculateMonthExpense(summary, "Groceries"),
        },
        {
          id: "1",
          category: "Food",
          imagePath: require(`../../../../assets/expenses/food-icon.png`),
          expense: calculateMonthExpense(summary, "Food"),
        },
        {
          id: "2",
          category: "Fuel",
          imagePath: require(`../../../../assets/expenses/fuel-icon.png`),
          expense: calculateMonthExpense(summary, "Fuel"),
        },
        {
          id: "3",
          category: "Transportation",
          imagePath: require(`../../../../assets/expenses/transportation-icon.png`),
          expense: calculateMonthExpense(summary, "Transportation"),
        },
        {
          id: "4",
          category: "Entertainment",
          imagePath: require(`../../../../assets/expenses/entertainment-icon.png`),
          expense: calculateMonthExpense(summary, "Entertainment"),
        },
        {
          id: "5",
          category: "Housing",
          imagePath: require(`../../../../assets/expenses/housing-icon.png`),
          expense: calculateMonthExpense(summary, "Housing"),
        },
        {
          id: "6",
          category: "Clothing",
          imagePath: require(`../../../../assets/expenses/clothing-icon.png`),
          expense: calculateMonthExpense(summary, "Clothing"),
        },
        {
          id: "7",
          category: "Health",
          imagePath: require(`../../../../assets/expenses/health-icon.png`),
          expense: calculateMonthExpense(summary, "Health"),
        },
        {
          id: "8",
          category: "Others",
          imagePath: require(`../../../../assets/expenses/others-icon.png`),
          expense: calculateMonthExpense(summary, "Others"),
        },
      ])
    );
  } catch (err) {
    console.log(err);
  }
}

const sagas = [takeLatest(ExpensesActionType.FETCH_EXPENSES, fetchExpenses)];

export default sagas;
