// This is where the server passing on http calls to its internal copy of the blockchain
const Blockchain = require('./blockchain').Blockchain
const chain = new Blockchain()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// use command line arguments as port and node identifier
let port = process.argv[2]
let nodeID = process.argv[3]

if (!port || !nodeID) {
    console.error('Please provide 2 arguments: port and node identifier')
    process.exit()
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// print node information?
app.get('/', (req, res) => res.send('Welcome to STChain: More Info At https://github.com/scottmtraver/STChain'))

// Register Routes
app.get('/mine', mine);
app.get('/chain', displayChain);
app.get('/consensus', consensus);
app.post('/transaction', transaction);
app.post('/register', registerNode);

function displayChain (req, res) {
    res.send(chain)
}

function mine (req, res) {
    let lastBlock = chain.lastBlock();
    let lastProof = lastBlock.proof;
    let proof = chain.proofOfWork(lastProof)


    let prevHash = chain.hashBlock(lastBlock)
    let block = chain.newBlock(proof, prevHash)

    chain.newTransaction(0, nodeID, 1); // add a new transaction 

    res.send('New Block Awarded!')
}

function transaction (req, res) {
    let ret = chain.newTransaction(req.body.sender, req.body.recepient, req.body.amount);
    console.log('Transaction added to block')
    res.send(JSON.stringify(ret))
}

function registerNode (req, res) {
    chain.registerNode(req.body.nodeUrl)
    console.log('Node registered on network')
    res.send('Registered ' + req.body.nodeUrl)
}

function consensus (req, res) {
    let ret = chain.resolveConflicts()
    console.log('Resolving Conflicts')
    res.send('Resolving Conflicts');
}


app.listen(port, () => {
    console.log('Blockchain Node Started On Port: ' + port)
    console.log('Node-ID: ' + nodeID)
})