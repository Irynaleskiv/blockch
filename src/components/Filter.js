import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  GET_BLOCKS,
  FETCH_BLOCK,
  FETCH_TRANSACTION, FETCH_ADDRESS
} from '../core/redux/types';
import BlockTable from "./BlockTable";
import TransactionTable from "./TransactionTable";
import AddressTable from "./AddressTable";
import BlockTransactionBar from "./BlockTransactionBar";

export class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      selectedItem: 'block'
    }
  }

  componentDidMount() {
    this.props.getBlocksData();
  }

  changeSelectedItem = (event) => {
    this.setState({
      selectedItem: event.target.value
    })
  };

  changeSearchValue = (event) => {
    this.setState({
      searchValue: event.target.value
    })
  };

  getPlaceholderName() {
    switch (this.state.selectedItem) {
      case 'block':
        return 'block hash';
      case 'transaction':
        return 'transaction id';
      case 'address':
        return 'address';
      default:
        return null;
    }
  };

  fetchItemData = () => {
    const { fetchBlockData, fetchTransactionData, fetchAddressData } = this.props;
    const { selectedItem, searchValue } = this.state;

    switch (selectedItem) {
      case 'block':
        return fetchBlockData(searchValue);
      case 'transaction':
        return fetchTransactionData(searchValue);
      case 'address':
        return fetchAddressData(searchValue);
      default:
        return null;
    }
  };

  render() {
    const { searchValue, selectedItem } = this.state;
    const { blocks, address, transactions } = this.props;
    const { currentBlock } = blocks;
    const { currentTransaction } = transactions;
    const { currentAddress } = address;
    const { addressTransactions } = currentAddress;
    const isBlock = selectedItem === 'block' && currentBlock && currentBlock.hash;
    const isHash = selectedItem === 'transaction' && currentTransaction && currentTransaction.transactionId;
    const isAddress = selectedItem === 'address' && (currentAddress && addressTransactions && addressTransactions.length);

    return (
      <div className="blockchain-content">
        <div className="filter-container">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={searchValue}
              onChange={this.changeSearchValue}
              placeholder={`Enter ${this.getPlaceholderName()}...`}
            />
          </div>
          <div className="form-group">
            <select
              placeholder="Select the item..."
              className="form-control"
              onChange={this.changeSelectedItem}
              value={selectedItem}
            >
              <option value="block">Block Hash</option>
              <option value="transaction">Transaction ID</option>
              <option value="address">Address</option>
            </select>
          </div>
          <Button onClick={this.fetchItemData} bsStyle="primary" block>
            Search
          </Button>
        </div>
        {
          !isBlock && !isHash && !isAddress && (
            <div className="chart-bar-wrapper">
              <BlockTransactionBar data={blocks}/>
            </div>
          )
        }
        <div style={{ margin: '20px', color: 'white' }}>
          {
            isBlock && (
              <BlockTable data={currentBlock}/>
            )
          }
          {
            isHash && (
              <TransactionTable data={currentTransaction}/>
            )
          }
          {
            isAddress && (
              <AddressTable data={currentAddress}/>
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  blocks: state.blocks,
  address: state.address,
  transactions: state.transactions
});

const mapDispatchToProps = (dispatch) => ({
  getBlocksData() {
    dispatch({ type: GET_BLOCKS });
  },
  fetchBlockData(blockHash) {
    dispatch({ type: FETCH_BLOCK, data: blockHash });
  },
  fetchTransactionData(transactionId) {
    dispatch({ type: FETCH_TRANSACTION, data: transactionId });
  },
  fetchAddressData(address) {
    dispatch({ type: FETCH_ADDRESS, data: address });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);