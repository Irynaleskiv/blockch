import React from 'react';

const BlockTable = (props) => {
  const { data } = props;

  return (
    <div>
      <h3 className="table-title">Block</h3>
      <div className="table-wrapper">
        <table className="table table-striped">
          <tbody>
          <tr>
            <td className="bold">Block Hash</td>
            <td>{data.hash}</td>
          </tr>
          <tr>
            <td className="bold">Index</td>
            <td>{data.index}</td>
          </tr>
          <tr>
            <td className="bold">Time Stamp</td>
            <td>{data.timestamp}</td>
          </tr>
          <tr>
            <td className="bold">Nonce</td>
            <td>{data.nonce}</td>
          </tr>
          <tr>
            <td className="bold">Previous Hash</td>
            <td>{data.previousBlockHash}</td>
          </tr>
          <tr>
            <td className="bold">Number Transactions</td>
            <td>{data.transactions && data.transactions.length}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockTable;