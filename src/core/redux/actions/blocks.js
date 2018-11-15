import { call, all, put, takeEvery } from 'redux-saga/effects';
import * as API from '../../../helpers/API';
import {
  GET_BLOCKS,
  GET_BLOCKS_SUCCESS,
  GET_BLOCKS_FAILED,
  FETCH_BLOCK,
  FETCH_BLOCK_SUCCESS,
  FETCH_BLOCK_FAILED
} from '../types.js';

export function* getBlocksData() {
  try {
    const blocksData = yield call(API.getBlocksData);
    yield put({
      type: GET_BLOCKS_SUCCESS,
      data: { blocks: blocksData.chain }
    });
  } catch (error) {
    yield put({ type: GET_BLOCKS_FAILED });
  }
}

export function* fetchBlockData(action) {
  try {
    const blockData = yield call(API.fetchBlockData, action.data);
    yield put({
      type: FETCH_BLOCK_SUCCESS,
      data: { currentBlock: blockData.block }
    });
  } catch (error) {
    yield put({ type: FETCH_BLOCK_FAILED });
  }
}

export default function* blocksSaga() {
  yield all([
    takeEvery(GET_BLOCKS, getBlocksData),
    takeEvery(FETCH_BLOCK, fetchBlockData),
  ]);
}
