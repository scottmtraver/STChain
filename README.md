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

## Server Commands

To run a node of the STCoin network:

```
npm start [node-port] [node-identifier]
```
For example:

```
npm start 5000 scotts-node
```
will start a node on localhost:5000 with an id of scotts-node

You cannot have two nodes running on the same port.

You may wish to run several nodes for fun and to test the consensus resolution.

You will need to register the nodes with eachother manually with the register command below.

The server will log many of the operations so you can see confirmations and the internals of the blockchain.

## HTTP Commands


## Theory

```
Block Structure
{
    'index': 1, //transaction number
    'timestamp': 1506057125.900785, // time
    'transactions': [
        {
            'sender': "8527147fe1f5426f9dd545de4b27ee00", // wallet
            'recipient': "a77f5cdfa2934df3954a5c7c7da5df1f", // wallet
            'amount': 5, // transaction amount
        }
    ],
    'proof': 324984774000, // valid proof of work
    'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```


## Questions

why can't a small network have broadcast consensus resolution (because of async timing)
should you validate at regular intervals? or before a transaction?
performance
network performance?
cost of transactions between nodes

## Resources

[hackernoon - Python Blockchain](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46)

[hackernoon - wtf is blockchain](https://hackernoon.com/wtf-is-the-blockchain-1da89ba19348)

[Blockchain Whitepaper Summary](https://hackernoon.com/95percent-blockchain-technology-d28673e55673)