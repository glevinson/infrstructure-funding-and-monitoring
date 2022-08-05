// Packages:
//*************************************************************************************************************** */
const express = require('express')
const ethers = require('ethers') // Library for "interacting with the Ethereum Blockchain and its ecosystem" [1]
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

Test DAI contract address: 0xb73217cA9721B3ea6561A09E77F3F9B5bfF716A0 - Minted myself over 1000 DAI (i.e. > 1000 * 10**18) & approved all below contracts

Project Marketplace Data: name: The Sping DAO Project Marketplace Test 2, Symbol: SpringDAOtest2
            contract address: 0x27727F7566C560f4a58f7b6354863868DAbD1E72
            My account "    : 0x1497914eC6B09E7749cFCc09b31623867F438848



  Project 1 data: 10000, "Test Project 1", "TP1", "Test  Project Token URI" , 0xb73217cA9721B3ea6561A09E77F3F9B5bfF716A0 
            contract address: 0xAEF9823315beaDA83DBEF5a50315eEBdD9eA6168
            Invested: 5000 * 10^18 DAI
            Corresponding tokenID: 998928621658257890679642152570123416578288148840

  Project 2 data: 15000, "Test Project 2", "TP2", "Test  Project 2 Token URI" , 0xb73217cA9721B3ea6561A09E77F3F9B5bfF716A0
            contract address: 0x86ea58718b0cD6c06b8833BecB3F3C00A9a7ba24
            Invested: 1 * 10^18 DAI
            Corresponding tokenID: 770230842184749473687259574749180065129567861284

  Project 3 data: 20000, "Test Project 3", "TP3", "Test  Project 3 Token URI" , 0xb73217cA9721B3ea6561A09E77F3F9B5bfF716A0
            contract address: 0xf8195A7e49D44D4BC471e6554601e7ed21C7F95B
            Invested: 20000 * 10^18 DAI (whole amount)
            Corresponding tokenID: 1416395112873723536423559337374454453661927471451
            Redeemed the NFT: 
              Ownership of NFT has been transfered to me!

  Project 4 data: 25000, "Test Project 4", "TP4", "Test  Project 4 Token URI" , 0xb73217cA9721B3ea6561A09E77F3F9B5bfF716A0
            contract address: 0x11e9ed5D978150F0Bc4637b5B4a092b5106854d4
            Invested: 25000 * 10^18 DAI (whole amount)
            Corresponding tokenID: 102269594194673733253742275103562263623608325332
*/

// Specfifying which blockchain:
const provider = ethers.getDefaultProvider("rinkeby")

const projectMarketplaceAddress = "0x27727F7566C560f4a58f7b6354863868DAbD1E72";

// Creating an instance of the NFT contract - object with  shape of the ABI (has all listed functions) & is deployed on specified network with address you specified
const projectMarketPlace = new ethers.Contract(projectMarketplaceAddress, abiNFT, provider);

// Example data displayed at the home page of the local host at port 3000
app.get('/', (req, res) => {
  res.send([{ name: "bla bla", quantity: 21234 }])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//*************************************************************************************************************** */
// References:
// [1] - https://docs.ethers.io/v5/
