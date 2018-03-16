let readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
const Blockchain = require('./blockchain').Blockchain

// print menu
function printMenu () {
    console.log('print - displays the entire blockchain')
    console.log('mine - mines and seals a block of the pending transactions and awards a coin')
    console.log('transfer - add a transaction to pending transactions: requires sender, receiver, amount')
    console.log('validate - run chain validation')
    console.log('verbose - toggle verbose mode logging')
    console.log('help - prints menu')
    console.log('ctrl-C to exit :D')
}

function printBlockchain (chain) {
    console.log('Pending transactions: ')
    chain.current_transactions.forEach((t) => {
        console.log(t)
    })
    console.log('Blocks: ')
    chain.chain.forEach((b) => {
        console.log(b)
    })
}

printMenu()

// Start the blockchain!
const chain = new Blockchain()
let verbose = false
let wallet = 'my-wallet'

rl.setPrompt('SCOTT-COIN> ');
rl.prompt();

rl.on('line', function(line) {
    switch(line.split(' ')[0]) {
        case 'print':
            printBlockchain(chain)
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
        case 'validate':
            let valid = chain.validate(verbose);
            if (valid) {
                console.log('Blockchain is valid :-)')
            } else {
                console.log('Blockchain is Not valid :-(')
            }
            break;
        case 'verbose':
            verbose = !verbose
            console.log('Toggeling Verbose Mode: ' + (verbose ? 'on' : 'off'))
            break;
        case 'help':
            printMenu()
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

    let prevHash = chain.hashBlock(lastBlock)
    let block = chain.newBlock(proof, prevHash)
    chain.newTransaction(0, wallet, 1); // add a new transaction 
}