import axios from 'axios';
const REACT_APP_API_URL = 'http://localhost:3001';

export const getBlocksData = async () => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/blockchain`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBlockData = async (blockHash) => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/block/${blockHash}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTransactionData = async (transactionId) => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/transaction/${transactionId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAddressData = async (address) => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/address/${address}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};