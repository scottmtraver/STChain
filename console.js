let readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
const Blockchain = require('./blockchain').Blockchain

// print menu
console.log('print - displays the entire blockchain')
console.log('mine - mines and seals a block of the pending transactions and awards a coin')
console.log('transfer - add a transaction to pending transactions: requires sender, receiver, amount')
console.log('verbose - toggle verbose mode logging')
console.log('ctrl-C to exit :D')

// Start the blockchain!
const chain = new Blockchain()
let verbose = false
let wallet = 'my-wallet'

rl.setPrompt('SCOTT-COIN> ');
rl.prompt();

rl.on('line', function(line) {
    switch(line.split(' ')[0]) {
        case 'print':
            console.log(chain)
            break;
        case 'mine':
            console.log('Mining Block...')
            mine(verbose)
            console.log('Block Mined!')
            break;
        case 'transfer':
            let tokens = line.split(' ')
            let fromAddress = tokens[1]
            let toAddress = tokens[2]
            let amount = tokens[3]
            if (!(fromAddress && toAddress && amount)) {
                console.log('Please provide a from address, to address, and amount')
                break;
            }
            // add to pending transactions
            chain.newTransaction(fromAddress, toAddress, amount)
            console.log('Transfer pending')
            break;
        case 'verbose':
            console.log('Toggeling Verbose Mode: ' + !verbose)
            verbose = !verbose
            break;
        default:
            console.warn('Invalid Action')
        break;
    }
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});

function mine (verbose) {
    let lastBlock = chain.lastBlock();
    let lastProof = lastBlock.proof;
    if (verbose) { console.log('- Performing Proof Of Work') }
    let proof = chain.proofOfWork(lastProof, verbose)

    if (verbose) { console.log('- Awarding Coin') }
    chain.newTransaction(0, wallet, 1); // add a new transaction 

    let prevHash = chain.hashBlock(lastBlock)
    let block = chain.newBlock(proof, prevHash)
}