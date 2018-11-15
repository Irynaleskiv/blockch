import React from 'react';

const AddressTable = (props) => {
  const { data } = props;

  return (
    <div>
      <h3 className="table-title">Address</h3>
      <div className="table-wrapper">
        <h3>Total amount: {data.addressBalance}</h3>
        <table className="table table-striped">
          <thead>
          <tr>
            <th scope="col">Sender</th>
            <th scope="col">Recipient</th>
            <th scope="col">Amount</th>
          </tr>
          </thead>
          <tbody>
          {data.addressTransactions && data.addressTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.sender}</td>
              <td>{transaction.recipient}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddressTable;