// Packages:
//*************************************************************************************************************** */
const express = require('express');
const ethers = require('ethers'); // Library for "interacting with the Ethereum Blockchain and its ecosystem" [1]
const app = express();
const port = 8000;
const fetch = require('node-fetch');
const cors = require('cors');
app.use(cors());
//*************************************************************************************************************** */

// ABIs, one for NFT & one for RFT:
//*************************************************************************************************************** */
const abiNFT = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "nftId", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const abiRFT = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function name() public view returns (string memory)",
  // "function dataAccessThreshold() public view returns (uint256)",    
  "function totalSupply() public view returns (uint256)",
  "function amountRaised() public view returns (uint256)",
  "function istargetRaised() public view returns (bool)",
  "function dataAccessThreshold() public view returns (uint256)"
  
  // {
  //   "inputs": [],
  //   "name": "dataAccessThreshold",
  //   "outputs": [
  //     {
  //       "internalType": "uint256",
  //       "name": "",
  //       "type": "uint256"
  //     }
  //   ],
  //   "stateMutability": "view",
  //   "type": "function"
  // }
  // [
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "amount",
  //         "type": "uint256"
  //       },
  //       {
  //         "internalType": "string",
  //         "name": "name",
  //         "type": "string"
  //       },
  //       {
  //         "internalType": "string",
  //         "name": "symbol",
  //         "type": "string"
  //       },
  //       {
  //         "internalType": "uint256",
  //         "name": "_dataAccessThreshold",
  //         "type": "uint256"
  //       },
  //       {
  //         "internalType": "address",
  //         "name": "_admin",
  //         "type": "address"
  //       },
  //       {
  //         "internalType": "address",
  //         "name": "coinAddress",
  //         "type": "address"
  //       }
  //     ],
  //     "stateMutability": "nonpayable",
  //     "type": "constructor"
  //   }
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

// NEW TEST DATA

/* Deployed Test Projects from the above contract on Goerli testnet:

Test DAI contract address: 0x5d690F5e5D04b93E8791A9cFD95D17A527a5946A  - Minted myself over 1000000 (1 million) DAI (i.e. > 1000 * 10**18) & approved all below contracts

Project Marketplace Data: name: The Sping DAO Project Marketplace Test 2, Symbol: SpringDAOtest2
            contract address: 0x23D33939c95d0608C1d6Ee9D2240B732319A1Dc4
            My account "    : 0x1497914eC6B09E7749cFCc09b31623867F438848

  Project 1 data: 50000000000000000000000, "Water System: Ndemban, The Gambia", "waterNDEM", "ipfs://QmcVrb7HMiFWQR5W4muk7MAe5vU8pm16eAodFHtkPpzBNt", 50000000000000000000, 0x5d690F5e5D04b93E8791A9cFD95D17A527a5946A
            <=> 50k
            contract address: 0x111d9A74d590ce70766131840F67B42F9F1DD5e5
            Invested: 0 DAI
            Corresponding tokenID: 97713019763428154826298704328642032226132678117
            Link To Show Registered: https://goerli.pixxiti.com/nfts/0x23d33939c95d0608c1d6ee9d2240b732319a1dc4/97713019763428154826298704328642032226132678117

  <Project 2 is misdeploy; has project 1 URI rather than own...>

  Project 3 data: 100000000000000000000000, "Water System: Adwumakase Kese, Ghana", "waterADWU", "ipfs://QmeKFbSjSDT44iZy3FtP5meiyQJnGSoZPrKeqWExs59Puc", 50000000000000000000, 0x5d690F5e5D04b93E8791A9cFD95D17A527a5946A
            <=> 100k
            contract address: 0x9456C66600406aE299A83B479665A7901b553Dbc
            Invested: 25000000000000000000 (25) DAI - Should not have access to data
            Corresponding tokenID: 846865781110752272528720200731431149724599926204
            Link To Show Registered: https://goerli.pixxiti.com/nfts/0x23d33939c95d0608c1d6ee9d2240b732319a1dc4/846865781110752272528720200731431149724599926204

  Project 4 data: 150000000000000000000000, "Water System: Endanachan, Tanzania", "waterENDA", "ipfs://QmYnHab5W8ufsugRKUYRL5sTAd32d9Aq2kHAEBbZmWZM4o", 25000000000000000000, 0x5d690F5e5D04b93E8791A9cFD95D17A527a5946A
            <=> 150k
            contract address: 0x6FB276f9aF38beE168De1Fc04b09d8Ad15635ffa
            Invested: 30000000000000000000 (30) DAI - Should have access to Data
            Corresponding tokenID: 637677872419743488534908492414663507135982428154
            Redeemed the NFT: 
            Link To Show Registered: https://goerli.pixxiti.com/nfts/0x23d33939c95d0608c1d6ee9d2240b732319a1dc4/637677872419743488534908492414663507135982428154


  Project 5 data: 200000000000000000000000, "Water System: Jarreng, The Gambia", "waterJAR", "ipfs://QmQ1Ag65PuMnMm6whDqL7msEDnuVT7RvuF45RaUMJ8Xkg1", 25000000000000000000, 0x5d690F5e5D04b93E8791A9cFD95D17A527a5946A
            <=> 200k
            contract address: 0x9a9d2626AD68eD9F9f8b92652119446787876d56
            Invested: 200k DAI (Whole amount) - Should have access to the data
            Corresponding tokenID: 882689119131137206171968270147289883819851083094
            Link To Show Registered: https://goerli.pixxiti.com/nfts/0x23d33939c95d0608c1d6ee9d2240b732319a1dc4/882689119131137206171968270147289883819851083094
*/

// Storing mock data in a map (purely for proof of concept)
// These images are stored on image hosting website/server @ https://augustus-levinso.imgbb.com/
//*************************************************************************************************************** */
const dataMap = new Map();

dataMap.set('Water System: Adwumakase Kese, Ghana', "https://i.ibb.co/R9gq2k6/Adwumakase-Kese-Ghana.png");
dataMap.set('Water System: Endanachan, Tanzania', "https://i.ibb.co/GHNScvW/Endanachan-Tanzania.png");
dataMap.set('Water System: Jarreng, The Gambia', "https://i.ibb.co/RCcNw2k/Jarreng-The-Gambia.png");
dataMap.set('Water System: Ndemban, The Gambia', "https://i.ibb.co/PzyyvWR/Ndemban-The-Gambia.png");

//*************************************************************************************************************** */

// Specfifying which blockchain:
const provider = ethers.getDefaultProvider("goerli")

const projectMarketplaceAddress = "0x23D33939c95d0608C1d6Ee9D2240B732319A1Dc4";

// Creating an instance of the NFT contract - object with  shape of the ABI (has all listed functions) & is deployed on specified network with address you specified
const projectMarketPlace = new ethers.Contract(projectMarketplaceAddress, abiNFT, provider);

// Example data displayed at the home page of the local host at port 3000
app.get('/', (req, res) => {
  res.json("Backend Local Server");
})

app.get('/accessData/', async function (req, res) {
// req = request (an object containing info about the HTTP request that raised the event) & res = response (HTTP response)
  /* 
    NB: The signiture is a hash of the message and the users signiture
    By getting the user to sign this particular message, we can deduce their account address which we know to be theirs
    (Rather than user specifying their address - would allow "pretending" to be a different address)
    Signature is calculated off-chain; same for mainnet as Rinkeby & other testnets
  */
  try {
    const sig = req.query.signature;
    const signingAddress = ethers.utils.verifyMessage("I would like to see my Spring DAO data", /*req.params.*/sig); // Finding the users address
    const projectMarketplaceSupply = (await projectMarketPlace.totalSupply()).toNumber() // promise returns {"type":"BigNumber","hex":"0x01"} where 1 is supply at time of testing.
    // BigNumber is a ethers data type, .toNumber() converts a BigNumber to a JS 'number' data type

    /* My accounts signiture for this message (verified by etherscan) is: 
       0xb036622d4db705e108c89f67210a2fb1f140a345afe0f6bf8b80ede4ae0b1846462d2d32f68acfa7961bac57c1600331d73521103ed8d4dcabca72e2c1dcc2361c */

    // Data that is returned:
    const data = []

    // Iterate through all NFTs and their RFTs - grant access if balance above threshold
    for (let i = 0; i < projectMarketplaceSupply; i++) {

      const tokenID = (BigInt(await projectMarketPlace.tokenByIndex(i))); // Important to use BigInt here as the address corresponds to a uint256, which allows a magnitude of [.....]
      // Maximum value supported by javascripts "Number" datatype is 2^53 -1. Although in reality an address is mostly
      // prefixed by zeros (so tokenID doesn't go above 2^53 -1), it is important that we can cater for one that might
      const rftAddress = "0x" + tokenID.toString(16);
      const rft = new ethers.Contract(rftAddress, abiRFT, provider);
      const balanceRFT = (await rft.balanceOf(signingAddress)); // By default is a Big Number
      const threshold = ethers.BigNumber.from(await rft.dataAccessThreshold());

      if ((await projectMarketPlace.ownerOf(tokenID)) == signingAddress || balanceRFT.gte(threshold) /* Returns true if balanceRFT >= threshold / balanceRFT >= 50 dataAccessThreshold*/ ) { // I.e. if user owns the NFT itself or has above threshold of RFT...
        const projectName = await rft.name();
        data.push({ name: projectName, url: dataMap.get(projectName) })
      }
      // If have some RFT with a project but not over the threshold 
      else if ( balanceRFT.gt(0) ){ 
        const projectName = await rft.name();
        data.push({ name: projectName, url: null })
      }
    }
    if (data.length == 0){
      data.push(null)
    }
    res.json(data)
  }
  catch (e) {
    console.error("Error: ", e)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

//*************************************************************************************************************** */
// References:
// [1] - https://docs.ethers.io/v5/