const crypto = require('crypto');

// Find a number p that when hashed with the previous block’s solution a hash with 4 leading 0s is produced.

function ValidateProof (last_proof, proof) {
    let hash = crypto.createHash('sha256');
    let guess = hash.update(String(last_proof + proof)).digest('hex');
    console.log(guess)
    return guess.slice(0, 4) == '0000';
}

function Blockchain () {
// Block Structure
// block = {
//     'index': 1,
//     'timestamp': 1506057125.900785,
//     'transactions': [
//         {
//             'sender': "8527147fe1f5426f9dd545de4b27ee00",
//             'recipient': "a77f5cdfa2934df3954a5c7c7da5df1f",
//             'amount': 5,
//         }
//     ],
//     'proof': 324984774000,
//     'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
// }

    // properties
    this.current_transactions = [];
    this.chain = [];

    // functions
    this.newBlock = (proof, prev_hash) => {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now,
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
        proof = 0
        while (!ValidateProof(last_proof, proof)) {
            proof += 1
        }

        return proof
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