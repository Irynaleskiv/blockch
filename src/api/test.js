const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1540722273473,
      transactions: [ ],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0"
    },
    {
      index: 2,
      timestamp: 1540722285130,
      transactions: [ ],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0"
    },
    {
      index: 3,
      timestamp: 1540722308077,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "a9957310da9b11e8ab82597a38801412",
          transactionId: "b08f7da0da9b11e8ab82597a38801412"
        },
        {
          amount: 170,
          sender: "AGJHGJHVJHVHKJB",
          recipient: "VJHVJHCGCGGCGC",
          transactionId: "b4819f60da9b11e8ab82597a38801412"
        },
        {
          amount: 70,
          sender: "AGJHGJHVJHVHKJB",
          recipient: "VJHVJHCGCGGCGC",
          transactionId: "b6a5def0da9b11e8ab82597a38801412"
        },
        {
          amount: 300,
          sender: "AGJHGJHVJHVHKJB",
          recipient: "VJHVJHCGCGGCGC",
          transactionId: "b8c4c750da9b11e8ab82597a38801412"
        },
        {
          amount: 7000,
          sender: "AGJHGJHVJHVHKJB",
          recipient: "VJHVJHCGCGGCGC",
          transactionId: "bb82fcf0da9b11e8ab82597a38801412"
        }
      ],
      nonce: 40582,
      hash: "0000eb15dcb870b491aac9e654011d0076342b6f82f25b4073c7a47da423030e",
      previousBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    }
  ],
  pendingTransaction: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "a9957310da9b11e8ab82597a38801412",
      transactionId: "be365d20da9b11e8ab82597a38801412"
    },
    {
      amount: 300,
      sender: "AGJHGJHVJHVHKJB",
      recipient: "VJHVJHCGCGGCGC",
      transactionId: "c1092c30da9b11e8ab82597a38801412"
    },
    {
      amount: 100,
      sender: "AGJHGJHVJHVHKJB",
      recipient: "VJHVJHCGCGGCGC",
      transactionId: "c2d75c80da9b11e8ab82597a38801412"
    }
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [ ]
};

console.log('VALID', bitcoin.chainIsValid(bc1.chain));