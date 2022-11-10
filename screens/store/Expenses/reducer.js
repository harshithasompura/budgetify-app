import { ExpensesActionType } from "./types";

export const initialState = {
  budget: 1000,

  groceriesExpense: 0,
  foodExpense: 0,
  fuelExpense: 0,
  transportationExpense: 0,
  entertainmentExpense: 0,
  housingExpense: 0,
  clothingExpense: 0,
  healthExpense: 0,
  othersExpense: 0,

  expensesData: [],
};

// Budget
const setBudget = (state, payload) => ({
  ...state,
  budget: (payload && payload.budget) ?? state.budget,
});

// Expenses of different Categories
const setGroceriesExpense = (state, payload) => ({
  ...state,
  groceriesExpense:
    (payload && payload.groceriesExpense) ?? state.groceriesExpense,
});

const setFoodExpense = (state, payload) => ({
  ...state,
  foodExpense: (payload && payload.foodExpense) ?? state.foodExpense,
});

const setFuelExpense = (state, payload) => ({
  ...state,
  fuelExpense: (payload && payload.fuelExpense) ?? state.fuelExpense,
});

const setTransportationExpense = (state, payload) => ({
  ...state,
  transportationExpense:
    (payload && payload.transportationExpense) ?? state.transportationExpense,
});

const setEntertainmentExpense = (state, payload) => ({
  ...state,
  entertainmentExpense:
    (payload && payload.entertainmentExpense) ?? state.entertainmentExpense,
});

const setHousingExpense = (state, payload) => ({
  ...state,
  housingExpense: (payload && payload.housingExpense) ?? state.housingExpense,
});

const setClothingExpense = (state, payload) => ({
  ...state,
  clothingExpense:
    (payload && payload.clothingExpense) ?? state.clothingExpense,
});

const setHealthExpense = (state, payload) => ({
  ...state,
  healthExpense: (payload && payload.healthExpense) ?? state.healthExpense,
});

const setOthersExpense = (state, payload) => ({
  ...state,
  othersExpense: (payload && payload.othersExpense) ?? state.othersExpense,
});

// Array of categories
const setExpensesData = (state, payload) => ({
  ...state,
  expensesData: (payload && payload.expensesData) ?? state.expensesData,
});

const clearState = () => ({
  ...initialState,
});

const reducerMap = new Map([
  [ExpensesActionType.SET_BUDGET, setBudget],

  [ExpensesActionType.SET_GROCERIES_EXPENSE, setGroceriesExpense],
  [ExpensesActionType.SET_FOOD_EXPENSE, setFoodExpense],
  [ExpensesActionType.SET_FUEL_EXPENSE, setFuelExpense],
  [ExpensesActionType.SET_TRANSPORTATION_EXPENSE, setTransportationExpense],
  [ExpensesActionType.SET_ENTERTAINMENT_EXPENSE, setEntertainmentExpense],
  [ExpensesActionType.SET_HOUSING_EXPENSE, setHousingExpense],
  [ExpensesActionType.SET_CLOTHING_EXPENSE, setClothingExpense],
  [ExpensesActionType.SET_HEALTH_EXPENSE, setHealthExpense],
  [ExpensesActionType.SET_OTHERS_EXPENSE, setOthersExpense],

  [ExpensesActionType.SET_EXPENSES_DATA, setExpensesData],

  [ExpensesActionType.CLEAR, clearState],
]);

const reducer = (state = initialState, action) => {
  const reducer = reducerMap.get(action.type);
  if (reducer) return reducer(state, action.payload);
  return state;
};

export default reducer;
