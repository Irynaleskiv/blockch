import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers/index';
import sagas from './actions/index';

const saga = createSagaMiddleware();

export const initialState = {
  blocks: {
    allBlocks: [],
    currentBlock: {}
  },
  transactions: {
    allTransactions: [],
    currentTransaction: {}
  },
  address: {
    currentAddress: {}
  }
};

const middlewares = applyMiddleware(saga);

export default createStore(
  reducer,
  initialState,
  composeWithDevTools(middlewares)
);

saga.run(sagas);