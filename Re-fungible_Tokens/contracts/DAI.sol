// SPDX-License-Identifier: MIT
// THIS IS A MOCK DAI STABLECOIN
// Majority of this lifted from: https://github.com/jklepatch/eattheblocks/blob/b9318560a7358847193ef5959c38c967999c7a71/screencast/241-re-fungible-tokens/contracts/DAI.sol
//*****************************************************************************************************************
pragma solidity ^0.8;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract DAI is ERC20 {
  constructor() ERC20('DAI Stablecoin', 'DAI') {}

  function mint(address to, uint amount) external {
    _mint(to, amount);
  }
}
//*****************************************************************************************************************