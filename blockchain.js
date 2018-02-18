const crypto = require('crypto');
const http = require('http')
const rp = require('request-promise');

// Find a number p that when hashed with the previous block’s solution a hash with 4 leading 0s is produced.

function ValidateProof(last_proof, proof) {
    let hash = crypto.createHash('sha256');
    let guess = hash.update(String(last_proof + proof)).digest('hex');
    console.log(guess)
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
            console.log('block isnt hashed')
            return false
        }
        if (!ValidateProof(lastBlock.proof, currentBlock.proof)) {
            console.log('block proof isnt valid')
            return false
        }

        lastBlock = currentBlock
        index++
    }
    console.log("chain is valid")
    return true
}

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

    this.registerNode = (nodeUrl) => {
        this.nodes.push(nodeUrl);
        console.log(this.nodes)
    }

    // proof of work loop
    this.proofOfWork = (last_proof) => {
        proof = 0
        while (!ValidateProof(last_proof, proof)) {
            proof += 1
        }

        return proof
    }

    this.resolveConflicts = () => {
        let neighbors = this.nodes;
        let newChain = null;
        let maxLen = this.chain.length

        let promises = [];

        neighbors.forEach((url) => {
            promises.push(
                rp(url + '/chain')
            )
        })

        Promise.all(promises).then((data) => {
            data.forEach((chainJSON) => {
                console.log('checking ' + chainJSON)
                let chain = JSON.parse(chainJSON).chain
                let len = chain.length
                console.log(len + ' vs ' + maxLen)
                console.log(ValidChain(chain))
                console.log('here 2')
                if (len > maxLen && ValidChain(chain)) {
                    newChain = chain
                }
                console.log('inside all')
                console.log(data)

            })
            console.log("done checking")

            if (newChain) {
                this.chain = newChain
                console.log('chain replaces')
            }
        })

        // neighbors.forEach((url) => {
        //     console.log('checkin ' + url)

        //     http.get(url + '/chain', (res) => {
        //         res.on("data", function(chunk) {
        //             console.log('checking ' + chunk)
        //             let chain = JSON.parse(chunk).chain
        //             let len = chain.length
        //             console.log(len + ' vs ' + maxLen)
        //             console.log(ValidChain(chain))
        //             console.log('here 2')
        //             if (len > maxLen && ValidChain(chain)) {
        //                 this.chain = chain
        //             }
        //           });
        //     })
        // })

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