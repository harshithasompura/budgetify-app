const _getData = (state) => state.Expenses;

// Budget
const getBudget = (state) => _getData(state).budget;

// Expenses of different Categories
const getGroceriesExpense = (state) => _getData(state).groceriesExpense;
const getFoodExpense = (state) => _getData(state).foodExpense;
const getFuelExpense = (state) => _getData(state).fuelExpense;
const getTransportationExpense = (state) => _getData(state).transportationExpense;
const getEntertainmentExpense = (state) => _getData(state).entertainmentExpense;
const getHousingExpense = (state) => _getData(state).housingExpense;
const getClothingExpense = (state) => _getData(state).clothingExpense;
const getHealthExpense = (state) => _getData(state).healthExpense;
const getOthersExpense = (state) => _getData(state).othersExpense;

// Array of categories
const getExpensesData = (state) => _getData(state).expensesData;

const selectors = {
  getBudget,
  getGroceriesExpense,
  getFoodExpense,
  getFuelExpense,
  getTransportationExpense,
  getEntertainmentExpense,
  getHousingExpense,
  getClothingExpense,
  getHealthExpense,
  getOthersExpense,
  getExpensesData,
};

export default selectors;
