// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDTMock is ERC20{

	constructor () ERC20("USDTMock", "USDTM") {
		_mint(0x0dbBc7945661E4a82218F665A2744D2a65F9C536, 1000 * 10 ** decimals());
	}
	function decimals() public pure override returns (uint8) {
		return 6;
	}
}