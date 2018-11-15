const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');
const nodeAddress = uuid().split('-').join('');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// create an instance of Blockchain
const bitcoin = new Blockchain();

// get entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

// create new transaction
app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', function (req, res) {
  const { amount, sender, recipient } = req.body;
  const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'post',
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      res.json({note: 'Transaction created and broadcast successfully'});
    })
});

// mine a block
app.get('/mine', function(req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransaction,
    index: lastBlock.index + 1
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock },
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      const requestOptions = {
        uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress
        },
        json: true
      };

      return rp(requestOptions);
    })
    .then(data => {
      res.json({
        note: "New block mined & broadcast successfully",
        block: newBlock
      });
    });
});


// receive new block
app.post('/receive-new-block', function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock.index + 1 === newBlock.index;

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransaction = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock
    });
  }
});

// register a node and broadcast in the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl; //localhost:3005
  const { networkNodes } = bitcoin;
  if (networkNodes.indexOf(newNodeUrl) === -1) {
    networkNodes.push(newNodeUrl);
  }
  const registerNodesPromises = [];
  networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: {
        newNodeUrl: newNodeUrl
      },
      json: true
    };

    registerNodesPromises.push(rp(requestOptions));
  });

  Promise.all(registerNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
        },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: 'New node registered with network successfully.' })
    })
});

// register a node with the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const { networkNodes, currentNodeUrl } = bitcoin;

  const nodeNotAlreadyPresent = networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode) {
    networkNodes.push(newNodeUrl);
  }
  res.json({ note: 'New node registered successfully.' })
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  const { networkNodes, currentNodeUrl } = bitcoin;

  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = networkNodes.indexOf(networkNodeUrl) !== 1;
    const notCurrentNode = currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
      networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: 'Bulk registered successfully.' })
});

app.get('/consensus', function (req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(blockchains => {
      let maxChainLength = bitcoin.chain.length;
      let newLongestChain = null;
      let newPendingTransactions = null;

      blockchains.forEach(blockchain => {
        const { chain, pendingTransaction } = blockchain;
        if (chain.length > maxChainLength) {
          maxChainLength = chain.length;
          newLongestChain = chain;
          newPendingTransactions = pendingTransaction
        }
      });

      if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
        res.json({
          note: 'Current chain has not been replaced.',
          chain: bitcoin.chain
        })
      }
      else {
        bitcoin.chain = newLongestChain;
        bitcoin.pendingTransaction = newPendingTransactions;
        res.json({
          note: 'This chain has been replaced.',
          chain: bitcoin.chain
        })
      }
    })
});

app.get('/block/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({
    block: correctBlock
  })
});

app.get('/transaction/:transactionId', function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);
  const { block, transaction } = transactionData;
  res.json({
    transaction,
    block,
  })
});

app.get('/address/:address', function (req, res) {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  res.json({
    addressData
  })
});

app.listen(port, function () {
  console.log((`Listening on port ${port}...`));
});