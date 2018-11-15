import { combineReducers } from 'redux';
import blocks from './blocks';
import address from './address';
import transactions from './transactions';

export default combineReducers({
  blocks,
  address,
  transactions,
});
