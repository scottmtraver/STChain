const crypto = require('crypto');
const http = require('http')
const rp = require('request-promise');

function ValidateProof(last_proof, proof) {
// Find a number p that when hashed with the previous block’s solution a hash with 4 leading 0s is produced.
    let hash = crypto.createHash('sha256');
    let guess = hash.update(String(last_proof + proof)).digest('hex');
    return guess.slice(0, 4) == '0000';
}
// utility - this chain is valid
function ValidChain(chainToCheck) {
    let lastBlock = chainToCheck[0]
    let index = 1;

    while (index < chainToCheck.length) {
        let currentBlock = chainToCheck[index]
        let hash = crypto.createHash('sha256');
        if (currentBlock.previous_hash != hash.update(JSON.stringify(lastBlock)).digest('hex')) {
            console.log('Chain Invalid: Block isnt hashed')
            return false
        }
        if (!ValidateProof(lastBlock.proof, currentBlock.proof)) {
            console.log('Chain Invalid: Proofs don\'t match')
            return false
        }

        lastBlock = currentBlock
        index++
    }
    return true
}

// Blockchain Object
function Blockchain() {
    // properties
    this.current_transactions = [];
    this.chain = [];
    this.nodes = [];

    // functions
    this.newBlock = (proof, prev_hash) => {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.current_transactions,
            proof: proof,
            previous_hash: prev_hash
        };
        // reset transactions
        this.current_transactions = [];
        this.chain.push(block);

        return block;
    }

    // add a new transaction to this blockchain
    this.newTransaction = (sender, recepient, amount) => {

        this.current_transactions.push({
            sender: sender,
            recepient: recepient,
            amount: amount
        });

        return this.lastBlock().index + 1;
    }

    // proof of work loop
    this.proofOfWork = (last_proof) => {
        proof = Date.now();
        while (!ValidateProof(last_proof, proof)) {
            proof += 1
        }

        console.log('Latest Proof Of Work - ' + proof)
        return proof
    }

    // register another node in the network
    this.registerNode = (nodeUrl) => {
        this.nodes.push(nodeUrl);
    }

    // resolve conflicts against all other nodes in the 
    this.resolveConflicts = () => {
        let neighbors = this.nodes;
        let newChain = null;
        let maxLen = this.chain.length

        let promises = [];

        neighbors.forEach((url) => {
            console.log('Checking ' + url)
            promises.push(
                rp(url + '/chain')
            )
        })

        Promise.all(promises).then((data) => {
            data.forEach((chainJSON) => {
                let chain = JSON.parse(chainJSON).chain
                let len = chain.length
                if (len > maxLen && ValidChain(chain)) {
                    newChain = chain
                }
            })

            if (newChain) {
                console.log("Replacing Chain...")
                this.chain = newChain
                return this.chain
            }
        })
    }

    // utility get last block
    this.lastBlock = () => {
        return this.chain[this.chain.length - 1];
    }



    // utility hash a block
    this.hashBlock = (block) => {
        let hash = crypto.createHash('sha256');
        return hash.update(JSON.stringify(block)).digest('hex');
    }


    // seed the chain
    this.newBlock(1, 100);
}

module.exports = {
    Blockchain: Blockchain,
    ProofOfWork: ValidateProof
}