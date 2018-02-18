// This is where the server passing on http calls to its internal copy of the blockchain
const Blockchain = require('./blockchain').blockchain
const chain = new Blockchain()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const port = 5000;

// print node information?
app.get('/', (req, res) => res.send('Hello STChain'))

app.get('/mine', mine);
app.get('/chain', displayChain);
app.post('/transaction', transaction);


function displayChain (req, res) {
    res.send(chain)
}

function mine (req, res) {
    console.log('in mine')
    res.send('in mine')
}

function transaction (req, res) {
    chain.newTransaction(req.body.sender, req.body.recepient, req.body.amount);
    res.send('transaction added to block')
}


app.listen(port, () => console.log('Blockchain Node Started On ' + port))