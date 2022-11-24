import { combineReducers } from "redux";

import ExpensesReducer from "../store/Expenses/reducer";

const reducers = combineReducers({
  Expenses: ExpensesReducer,
});

export default reducers;
