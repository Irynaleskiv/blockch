import React from 'react';

const TransactionTable = (props) => {
  const { data } = props;

  return (
    <div>
      <h3 className="table-title">Transaction</h3>
      <div className="table-wrapper">
        <table className="table table-striped">
          <tbody>
          <tr>
            <td className="bold">Sender</td>
            <td>{data.sender}</td>
          </tr>
          <tr>
            <td className="bold">Recipient</td>
            <td>{data.recipient}</td>
          </tr>
          <tr>
            <td className="bold">Amount</td>
            <td>{data.amount}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;