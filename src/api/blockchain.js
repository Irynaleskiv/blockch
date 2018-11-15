const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransaction = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    // create Genesis Block
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransaction,
      nonce,
      hash,
      previousBlockHash
    };

    this.pendingTransaction = [];
    this.chain.push(newBlock);

    return newBlock;
  };

  getLastBlock() {
    return this.chain[this.chain.length -1];
  };

  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount,
      sender,
      recipient,
      transactionId: uuid().split('-').join('')
    };

    return newTransaction;
  };

  addTransactionToPendingTransactions(transactionObj) {
    this.pendingTransaction.push(transactionObj);
    return this.getLastBlock().index + 1;
  };

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    return sha256(dataAsString);
  };

  proofOfWork(previousBlockHash, currentBlockData) {
    // repeatedly hash block until it finds correct hash => '0000HKJVBKJHVHGCHJG'
    // continuously changes nonce value until it finds the correct hash
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  };

  chainIsValid(blockchain) {
    let validChain = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i -1];
      const { hash } = prevBlock;
      const { index, nonce, transactions, previousBlockHash } = currentBlock;
      const blockHash = this.hashBlock(hash, { transactions, index }, nonce);

      if (blockHash.substring(0, 4) !== '0000') {
        validChain = false;
      }
      if (previousBlockHash !== hash) {
        validChain = false;
      }
    }

    const genesisBlock = blockchain[0];
    const { nonce, hash, previousBlockHash, transactions } = genesisBlock;
    const correctNonce = nonce === 100;
    const correctHash = hash === '0';
    const correctPreviousBlockHash = previousBlockHash === '0';
    const correctTransactions = transactions.length === 0;

    if (!correctNonce || !correctHash || !correctPreviousBlockHash || !correctTransactions) {
      validChain = false;
    }

    return validChain;
  }

  getBlock(blockHash) {
    let correctBlock = null;

    this.chain.forEach(block => {
      if (block.hash === blockHash) {
        correctBlock = block;
      }
    });

    return correctBlock;
  };

  getTransaction(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      })
    });

    return {
      transaction: correctTransaction,
      block: correctBlock
    }
  };

  getAddressData(address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.sender === address || transaction.recipient === address) {
          addressTransactions.push(transaction);
        }
      })
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
      if (transaction.recipient === address) {
        balance += transaction.amount;
      }
      else if (transaction.sender === address) {
        balance -= transaction.amount;
      }
    });

    return {
      addressTransactions,
      addressBalance: balance
    }
  };
}

module.exports = Blockchain;
