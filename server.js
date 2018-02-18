// This is where the server passing on http calls to its internal copy of the blockchain
const Blockchain = require('./blockchain').Blockchain
const chain = new Blockchain()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// use command line arguments as port and node identifier
let port = process.argv[2]
let nodeID = process.argv[3]
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// print node information?
app.get('/', (req, res) => res.send('Hello STChain'))

// Routes
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

    chain.newTransaction(0, nodeID, 1); // add a new transaction 

    let prevHash = chain.hashBlock(lastBlock)
    let block = chain.newBlock(proof, prevHash)

    console.log(proof)
    res.send('New Block Awarded')
}

function transaction (req, res) {
    chain.newTransaction(req.body.sender, req.body.recepient, req.body.amount);
    res.send('transaction added to block')
}

function registerNode (req, res) {
    chain.registerNode(req.body.nodeUrl)
    res.send('new node registered')
}

function consensus (req, res) {
    chain.resolveConflicts()
    res.send('conflicts resolved')
}


app.listen(port, () => {
    console.log('Blockchain Node Started On Port: ' + port)
    console.log('Node-ID: ' + nodeID)
})