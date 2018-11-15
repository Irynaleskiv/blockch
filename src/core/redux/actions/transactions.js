import { call, all, put, takeEvery } from 'redux-saga/effects';
import * as API from '../../../helpers/API';
import {
  FETCH_TRANSACTION,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILED
} from '../types.js';

export function* fetchTransactionData(action) {
  try {
    const transactionData = yield call(API.fetchTransactionData, action.data);
    yield put({
      type: FETCH_TRANSACTION_SUCCESS,
      data: { transaction: transactionData.transaction }
    });
  } catch (error) {
    yield put({ type: FETCH_TRANSACTION_FAILED });
  }
}

export default function* transactionsSaga() {
  yield all([
    takeEvery(FETCH_TRANSACTION, fetchTransactionData)
  ]);
}
