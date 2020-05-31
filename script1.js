var Web3 = require('web3');

//const Web3HDWalletProvider = require("@truffle/hdwallet-provider");

//const mnemonic = "tide aim canvas snake inherit expect source thunder defense income cinnamon crumble"; 

const ERC20TransferABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "view",
        "type": "function"
    },
]

const DAIADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"

const senderAddress = "0x9eB7f2591ED42dEe9315b6e2AAF21bA85EA69F8C"

const receiverAddress = "0x00621a469ac414C93A0e0C8aaf105FD348194bC3"

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545', { timeout: 20000000 }));

//web3.setProvider(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxxxx")); 

//var provider = new Web3HDWalletProvider(mnemonic, web3);


const expectedBlockTime = 1000; 

const daiToken = new web3.eth.Contract(ERC20TransferABI, DAIADDRESS);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

(async function () {
    let starting_balance = await daiToken.methods.balanceOf(receiverAddress).call();
    daiToken.methods.transfer(receiverAddress, "10000000000000000000000").send({from: senderAddress}, async function(error, transactonHash) {
        console.log("Submitted transaction with hash: ", transactonHash)
        let transactionReceipt = null
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
            transactionReceipt = await web3.eth.getTransactionReceipt(transactonHash);
            await sleep(expectedBlockTime)
        }
        console.log("Got the transaction receipt: ", transactionReceipt)
        let final_balance = await daiToken.methods.balanceOf(receiverAddress).call();
        console.log('Starting balance was:', starting_balance);
        console.log('Ending balance is:', final_balance);
    });
 
})(); 

