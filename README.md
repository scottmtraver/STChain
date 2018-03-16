# STChain

This is a simple blockchain in javascript.
You can run multiple network nodes on your computer or on a network with friends.
Adapted from hackernoon (resources and links at bottom).


## Requirements

This is written entirely in javascript and runs on NodeJS (I use version 9, npm version 5)
You can get and install them at [NodeJS](https://nodejs.org/en/)

## Installation
Clone the project and install the npm packages

```
git clone https://github.com/scottmtraver/STChain.git
cd STChain
npm install
```

## Run Via Command Line

To run the blockchain on the command line (no network):

```
npm start
```
You will get a command line interface with the following commands:
```
$print -  displays the entire blockchain
$mine - mines and seals a block of the pending transactions and awards a coin
$transfer - simulate transaction with sender, receiver, amount
$verbose - toggle verbose flag
$help - reprint menu
```
Ctrl-C to quit
Mining awards appear under your wallet called `my-wallet`

## Run Via HTTP Server

To run a node of the STCoin network:

```
npm run server [node-port] [node-identifier]
```
For example:

```
npm run server 5000 scott
```
will start a node on localhost:5000 with an id of scotts. This can also be used as your 'wallet' id.

You cannot have two nodes running on the same port.

You may wish to run several nodes for fun and to test the consensus resolution.

You will need to register the nodes with eachother manually with the register command below.

The server will log many of the operations so you can see confirmations and the internals of the blockchain.

## HTTP Commands

Get the entire blockchain
```
curl -X GET -H "Content-Type: application/json" "http://localhost:5000/chain"
```

Make a transaction
```
curl -X POST -H "Content-Type: application/json" -d '{
 "sender": "scott",
 "recipient": "kevin",
 "amount": 5
}' "http://localhost:5000/transaction"
```

Mine a STCoin (Seal the last block)
```
curl -X GET -H "Content-Type: application/json" "http://localhost:5000/mine"
```

Bring this node into consensus with the rest of the network
```
curl -X GET -H "Content-Type: application/json" "http://localhost:5000/consensus"
```

Register a new node on the network
```
curl -X POST -H "Content-Type: application/json" -d '{
 "nodeUrl": "http://localhost:5001",
}' "http://localhost:5000/register"
```


## Theory

The blockchain is created with a seed block.

Current transactions are held until sealed via Mining.

Mining seals the blockchain with the currently held transactions in a new block awarding the node with 1 STCoin as the last transaction in the sealed block.
 
 - The Proof of Work is done by iterating through hashes starting at Date.now() and finding the first sha1 hash that starts in 4 '0's.
 - This is added to the string representation (JSON.stringify) of the last block and saved.
 - The chain can be validated by hashing these together starting with the first block.

Consensus amongst nodes is granted to the longest valid blockchain (done by iterating through registered node's /chain endpoints and replacing this nodes blockchain if necessary).


```
Block Structure
{
    'index': 1, //transaction number
    'timestamp': 1506057125, // time
    'transactions': [
        {
            'sender': "scott", // node-id
            'recipient': "kevin", // node-id
            'amount': 5, // transaction amount
        }
    ],
    'proof': 324984774000, // valid proof of work
    'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```


## Questions

### Broadcast Consensus Resolution?
Why can't a node broadcast consensus resolution? It may have to enact a freeze or buffer on other nodes so that there are no timing issues.

### Mining Intervals
Should you mine at regular intervals or before each transaction?

## Resources

[hackernoon - Python Blockchain](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46)

[hackernoon - wtf is blockchain](https://hackernoon.com/wtf-is-the-blockchain-1da89ba19348)

[Blockchain Whitepaper Summary](https://hackernoon.com/95percent-blockchain-technology-d28673e55673)