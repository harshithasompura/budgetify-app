import { ExpensesActionType } from "./types";

const actions = {
  // Set Budget
  setBudget: (budget) => ({
    type: ExpensesActionType.SET_BUDGET,
    payload: { budget },
  }),

  // Set Expenses of different Categories
  setGroceriesExpense: (groceriesExpense) => ({
    type: ExpensesActionType.SET_GROCERIES_EXPENSE,
    payload: { groceriesExpense },
  }),

  setFoodExpense: (foodExpense) => ({
    type: ExpensesActionType.SET_FOOD_EXPENSE,
    payload: { foodExpense },
  }),

  setFuelExpense: (fuelExpense) => ({
    type: ExpensesActionType.SET_FUEL_EXPENSE,
    payload: { fuelExpense },
  }),

  setTransportationExpense: (transportationExpense) => ({
    type: ExpensesActionType.SET_TRANSPORTATION_EXPENSE,
    payload: { transportationExpense },
  }),

  setEntertainmentExpense: (entertainmentExpense) => ({
    type: ExpensesActionType.SET_ENTERTAINMENT_EXPENSE,
    payload: { entertainmentExpense },
  }),

  setHousingExpense: (housingExpense) => ({
    type: ExpensesActionType.SET_HOUSING_EXPENSE,
    payload: { housingExpense },
  }),

  setClothingExpense: (clothingExpense) => ({
    type: ExpensesActionType.SET_CLOTHING_EXPENSE,
    payload: { clothingExpense },
  }),

  setHealthExpense: (healthExpense) => ({
    type: ExpensesActionType.SET_HEALTH_EXPENSE,
    payload: { healthExpense },
  }),

  setOthersExpense: (othersExpense) => ({
    type: ExpensesActionType.SET_OTHERS_EXPENSE,
    payload: { othersExpense },
  }),

  // Set the array of categories
  setExpensesData: (expensesData) => ({
    type: ExpensesActionType.SET_EXPENSES_DATA,
    payload: { expensesData },
  }),

  fetchExpenses: (email) => ({
    payload: { email },
    type: ExpensesActionType.FETCH_EXPENSES,
  }),

  clearState: () => ({
    type: ExpensesActionType.CLEAR,
  }),
};

export default actions;
