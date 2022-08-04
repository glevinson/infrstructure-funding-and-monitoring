// Packages:
//*************************************************************************************************************** */
const express = require('express')
const ethers = require('ethers') // Library for "interacting with the Ethereum Blockchain and its ecosystem" [1]
// const{ hexZeroPad } = require('@ethersproject/bytes') // Use to convert tokenID to hexadecimal
const app = express()
const port = 3000
//*************************************************************************************************************** */

// ABIs, one for NFT & one for RFT:
//*************************************************************************************************************** */
const abiNFT = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "nftId", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const abiRFT = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() public view returns (string memory)",
  "function totalSupply() public view returns (uint256)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];
//*************************************************************************************************************** */

/* Deployed Test Projects from the above contract on Rinkenby testnet:

Test DAI contract address: 0x6b326a63ec4694751B8a673586C221D4a90c0aB0 - Minted myself over 1000 DAI (i.e. > 1000 * 10**18) & approved all below contracts

Project Marketplace Data: name: The Sping DAO Project Marketplace Test 1, Symbol: SpringDAOtest1
            contract address: 0xe4ab33a2b7eeaA7A3F4E4515062d0b68a4c9f1f1
            My account "    : 0x1497914eC6B09E7749cFCc09b31623867F438848

  Project 1 data: 1000, "Test Project", "TP1", "Test  Project Token URI" , 0x6b326a63ec4694751B8a673586C221D4a90c0aB0 
            contract address: 0x8323572F0FA0a4DbF5e0e29aE4593AF8278fcF43
            Invested: 0 * 10^18 DAI

  Project 2 data: 2000, "Test Project 2", "TP2", "Test  Project 2 Token URI" , 0x6b326a63ec4694751B8a673586C221D4a90c0aB0
            contract address: 0x19276126A66A9b4b18f400785dcdAC3490B3d811
            Invested: 10 * 10^18 DAI

  Project 3 data: 3000, "Test Project 3", "TP3", "Test  Project 3 Token URI" , 0x6b326a63ec4694751B8a673586C221D4a90c0aB0
            contract address: 0xF1c00499adb74248E912954aC2BcF4a50EB88BFC
            Invested: 3000 * 10^18 DAI (whole amount)

  Project 4 data: 4000, "Test Project 4", "TP4", "Test  Project 4 Token URI" , 0x6b326a63ec4694751B8a673586C221D4a90c0aB0 /
            contract address: 0x062E6Bb1fEd9b3571CF89d76639424Ec82fAefBE
            Invested: 4000 * 10^18 DAI (whole amount)
*/

// Specfifying which blockchain:
const provider = ethers.getDefaultProvider("rinkeby")

const projectMarketplaceAddress = "0xe4ab33a2b7eeaA7A3F4E4515062d0b68a4c9f1f1";

// Creating an instance of the NFT contract - object with  shape of the ABI (has all listed functions) & is deployed on specified network with address you specified
const projectMarketPlace = new ethers.Contract(projectMarketplaceAddress, abiNFT, provider);

// Example data displayed at the home page of the local host at port 3000
app.get('/', (req, res) => {
  // res.send([{ name: "bla bla", quantity: 21234 }])
  
  // PROBLEM: FOR SOME REASON THIS NOT WORKING:
  // let rft = new ethers.Contract("0x062E6Bb1fEd9b3571CF89d76639424Ec82fAefBE", abiRFT, provider);
})

app.get('/accessData/:sig', async function (req, res) { 
  // ":sig" means <... filled with sig value >, req = request (an object containing info about the HTTP request that raised the event) & res = response (HTTP response)
  /* 
    NB: The signiture is a hash of the message and the users signiture
    By getting the user to sign this particular message, we can deduce their account address which we know to be theirs
    (Rather than user specifying their address - would allow "pretending" to be a different address)
    Signature is calculated off-chain; same for mainnet as Rinkeby & other testnets
  */
  const signingAddress = ethers.utils.verifyMessage("I would like to see my Spring DAO data", req.params.sig); // Finding the users address
  const projectMarketplaceSupply = (await projectMarketPlace.totalSupply()).toNumber() // promise returns {"type":"BigNumber","hex":"0x01"} where 1 is supply at time of testing.
                                                                                       // BigNumber is a ethers data type, .toNumber() converts a BigNumber to a JS 'number' data type

  /* My accounts signiture for this message (verified by etherscan) is: 
     0xb036622d4db705e108c89f67210a2fb1f140a345afe0f6bf8b80ede4ae0b1846462d2d32f68acfa7961bac57c1600331d73521103ed8d4dcabca72e2c1dcc2361c */

  // Data that is returned:
  const data = []

  // Iterate through all NFTs and their RFTs - grant access if balance above threshold
  for(let i = 0; i < projectMarketplaceSupply - 2; i++){

    const tokenID = (BigInt(await projectMarketPlace.tokenByIndex(i))); // Important to use BigInt here as the address corresponds to a uint256, which allows a magnitude of [.....]
                                                                        // Maximum value supported by javascripts "Number" datatype is 2^53 -1. Although in reality an address is mostly
                                                                        // prefixed by zeros (so tokenID doesn't go above 2^53 -1), it is important that we can cater for one that might
    const rftAddress = "0x" + tokenID.toString(16);
    const rft = new ethers.Contract(rftAddress, abiRFT, provider);
    const balanceRFT = (await rft.balanceOf(signingAddress));

    // data.push("Token ID " + i + " has a RFT balance of " + (balanceRFT )+ " and a data type of " + typeof(balanceRFT))

    if ( projectMarketPlace.ownerOf(tokenID) == signingAddress || balanceRFT > 0 /* Data Access Threshold */ ){ // I.e. if user owns the NFT itself or has above threshold of RFT...
      const projectName = await rft.name();
      data.push(" < " + projectName + " > Data ") // NB: Look into what data could dump here....
      // data["<Project Name>"] = "https://www.facebook.com/pages/category/Food---beverage/Fasdfasd-2407435632608750/"
    }
  }
  res.send(data)
});

// Now I have address of user (i.e. know this user is for real/verified)
// So need to go through their tokens; iterate through all the nft projects, for each project convert NFT ID to RFT address, getbalance of each RFT

// Now:
// Need a provider to read from blockchain: https://docs.ethers.io/v5/api/providers/ - connects to blockchain

//springdao.com/dataAccess?user=0x0eE704107ccDf5Ec43B17152A37afF8Ee4BdE93d&signature=0x342432423534534534534534523423423

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//*************************************************************************************************************** */
// References:
// [1] - https://docs.ethers.io/v5/
