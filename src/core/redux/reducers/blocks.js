import {
  GET_BLOCKS,
  GET_BLOCKS_SUCCESS,
  GET_BLOCKS_FAILED,
  FETCH_BLOCK,
  FETCH_BLOCK_SUCCESS,
  FETCH_BLOCK_FAILED
} from '../types';

export default (state = [], action) => {
  switch (action.type) {
    case GET_BLOCKS:
      return {
        ...state,
      };
    case GET_BLOCKS_SUCCESS:
      return {
        ...state,
        allBlocks: action.data.blocks
      };
    case GET_BLOCKS_FAILED:
      return {
        ...state,
        error: 'Error'
      };
    case FETCH_BLOCK:
      return {
        ...state,
      };
    case FETCH_BLOCK_SUCCESS:
      return {
        ...state,
        currentBlock: action.data.currentBlock
      };
    case FETCH_BLOCK_FAILED:
      return {
        ...state,
        error: 'Error'
      };
    default:
      return state;
  }
};



