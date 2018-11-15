import { call, all, put, takeEvery } from 'redux-saga/effects';
import * as API from '../../../helpers/API';
import {
  FETCH_ADDRESS,
  FETCH_ADDRESS_SUCCESS,
  FETCH_ADDRESS_FAILED
} from '../types.js';

export function* fetchAddressData(action) {
  try {
    const addressData = yield call(API.fetchAddressData, action.data);
    yield put({
      type: FETCH_ADDRESS_SUCCESS,
      data: { address: addressData.addressData }
    });
  } catch (error) {
    yield put({ type: FETCH_ADDRESS_FAILED });
  }
}

export default function* addressSaga() {
  yield all([
    takeEvery(FETCH_ADDRESS, fetchAddressData)
  ]);
}
