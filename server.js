// This is where the server passing on http calls to its internal copy of the blockchain
const Blockchain = require('./blockchain').blockchain

const express = require('express')
const app = express()
const port = 5000;

// print node information?
app.get('/', (req, res) => res.send('Hello STChain'))

app.get('/mine', mine);
app.get('/chain', displayChain);
app.post('/transaction', transaction);


function displayChain (req, res) {
    console.log('in displayChain')
    res.send('in display')
}

function mine (req, res) {
    console.log('in mine')
    res.send('in mine')
}

function transaction (req, res) {
    console.log('in transaction')
    res.send('in transaction')
}

const chain = new Blockchain()

app.listen(port, () => console.log('Blockchain Node Started On ' + port))