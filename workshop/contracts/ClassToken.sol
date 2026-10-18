// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts@5.0.2/token/ERC20/ERC20.sol";

/// @notice Classroom token with a fixed initial supply; no additional mint entry point.
contract ClassToken is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 wholeSupply
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, wholeSupply * 10 ** decimals());
    }
}
