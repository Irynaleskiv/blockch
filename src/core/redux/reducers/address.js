import {
  FETCH_ADDRESS,
  FETCH_ADDRESS_SUCCESS,
  FETCH_ADDRESS_FAILED
} from '../types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_ADDRESS:
      return {
        ...state,
      };
    case FETCH_ADDRESS_SUCCESS:
      return {
        ...state,
        currentAddress: action.data.address
      };
    case FETCH_ADDRESS_FAILED:
      return {
        ...state,
        error: 'Error'
      };
    default:
      return state;
  }
};
