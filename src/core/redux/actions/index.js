import blocksSaga from './blocks';
import addressSaga from './address';
import transactionsSaga from './transactions';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    blocksSaga(),
    addressSaga(),
    transactionsSaga()
  ]);
}