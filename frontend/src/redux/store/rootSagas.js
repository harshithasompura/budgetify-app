import { all } from "redux-saga/effects";

import expensesSagas from "./Expenses/sagas";

function* rootSagas() {
  yield all([...expensesSagas]);
}

export default rootSagas;
