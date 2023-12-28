// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WineStock.sol";

contract HelperContractForTest {
    WineStock private wineStock;

    constructor(address _wineStock) {
        wineStock = WineStock(payable(_wineStock));
    }

    function getWinePrice(uint256 wineId) public view returns (uint256) {
        return wineStock.getWinePrice(wineId);
    }

    function buyIdWinesFromStock(uint256 id, uint256 amount) public payable {
        wineStock.buyIdWinesFromStock{value: msg.value}(id, amount);
    }
}
