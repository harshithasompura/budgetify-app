import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import expensesActions from "../store/Expenses/actions";
import expensesSelectors from "../store/Expenses/selectors";

const useExpenses = () => {
  // Budget
  const budget = useSelector(expensesSelectors.getBudget);

  // Expenses of different Categories
  const groceriesExpense = useSelector(expensesSelectors.getGroceriesExpense);
  const foodExpense = useSelector(expensesSelectors.getFoodExpense);
  const fuelExpense = useSelector(expensesSelectors.getFuelExpense);
  const transportationExpense = useSelector(
    expensesSelectors.getTransportationExpense
  );
  const entertainmentExpense = useSelector(
    expensesSelectors.getEntertainmentExpense
  );
  const housingExpense = useSelector(expensesSelectors.getHousingExpense);
  const clothingExpense = useSelector(expensesSelectors.getClothingExpense);
  const healthExpense = useSelector(expensesSelectors.getHealthExpense);
  const othersExpense = useSelector(expensesSelectors.getOthersExpense);

  // Array of categories
  const expensesData = useSelector(expensesSelectors.getExpensesData);

  const dispatch = useDispatch();

  // Set Budget
  const setBudget = useCallback(
    (budget) => {
      dispatch(expensesActions.setBudget(budget));
    },
    [dispatch]
  );

  // Set Expenses of different Categories
  const setGroceriesExpense = useCallback(
    (groceriesExpense) => {
      dispatch(expensesActions.setGroceriesExpense(groceriesExpense));
    },
    [dispatch]
  );

  const setFoodExpense = useCallback(
    (foodExpense) => {
      dispatch(expensesActions.setFoodExpense(foodExpense));
    },
    [dispatch]
  );

  const setFuelExpense = useCallback(
    (fuelExpense) => {
      dispatch(expensesActions.setFuelExpense(fuelExpense));
    },
    [dispatch]
  );

  const setTransportationExpense = useCallback(
    (transportationExpense) => {
      dispatch(expensesActions.setTransportationExpense(transportationExpense));
    },
    [dispatch]
  );

  const setEntertainmentExpense = useCallback(
    (entertainmentExpense) => {
      dispatch(expensesActions.setEntertainmentExpense(entertainmentExpense));
    },
    [dispatch]
  );

  const setHousingExpense = useCallback(
    (housingExpense) => {
      dispatch(expensesActions.setHousingExpense(housingExpense));
    },
    [dispatch]
  );

  const setClothingExpense = useCallback(
    (clothingExpense) => {
      dispatch(expensesActions.setClothingExpense(clothingExpense));
    },
    [dispatch]
  );

  const setHealthExpense = useCallback(
    (healthExpense) => {
      dispatch(expensesActions.setHealthExpense(healthExpense));
    },
    [dispatch]
  );

  const setOthersExpense = useCallback(
    (othersExpense) => {
      dispatch(expensesActions.setOthersExpense(othersExpense));
    },
    [dispatch]
  );

    // Set the array of categories
    const setExpensesData = useCallback(
      (expensesData) => {
        dispatch(expensesActions.setExpensesData(expensesData));
      },
      [dispatch]
    );

  const fetchExpenses = useCallback(
    (email) => {
      dispatch(expensesActions.fetchExpenses(email));
    },
    [dispatch]
  );

  return {
    budget,
    groceriesExpense,
    foodExpense,
    fuelExpense,
    transportationExpense,
    entertainmentExpense,
    housingExpense,
    clothingExpense,
    healthExpense,
    othersExpense,
    expensesData,
    setBudget,
    setGroceriesExpense,
    setFoodExpense,
    setFuelExpense,
    setTransportationExpense,
    setEntertainmentExpense,
    setHousingExpense,
    setClothingExpense,
    setHealthExpense,
    setOthersExpense,
    setExpensesData,
    fetchExpenses,
  };
};

export default useExpenses;
