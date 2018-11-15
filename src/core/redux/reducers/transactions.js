import {
  FETCH_TRANSACTION,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILED
} from '../types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_TRANSACTION:
      return {
        ...state,
      };
    case FETCH_TRANSACTION_SUCCESS:
      return {
        ...state,
        currentTransaction: action.data.transaction
      };
    case FETCH_TRANSACTION_FAILED:
      return {
        ...state,
        error: 'Error'
      };
    default:
      return state;
  }
};
