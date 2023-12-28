// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "hardhat/console.sol";

contract WineStock is IERC1155Receiver, OwnableUpgradeable, UUPSUpgradeable {
    address private mainContractERC1155;
    mapping(uint256 => uint256) winePrice;

    event Withdrawal(address indexed to, uint amount);

    // Initialize function (replaces the constructor)
    function initialize(
        address initialOwner,
        address _mainContractERC1155
    ) public initializer {
        mainContractERC1155 = _mainContractERC1155;
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    // Ensure only owner can upgrade the contract
    function _authorizeUpgrade(address) internal override onlyOwner {}

    receive() external payable {}

    function withdraw() external onlyOwner {
        uint amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed.");

        emit Withdrawal(msg.sender, amount);
    }

    function getWinePrice(uint256 wineId) public view returns (uint256) {
        return winePrice[wineId];
    }

    function updateBatchWinePrice(
        uint256[] memory ids,
        uint256[] memory winePrices
    ) external onlyOwner {
        require(
            ids.length == winePrices.length,
            "HoldMyWine: incorrect array length to update price"
        );
        for (uint i = 0; i < ids.length; i++) {
            winePrice[ids[i]] = winePrices[i];
        }
    }

    function setAddressMainContractERC1155(
        address _mainContractERC1155
    ) external onlyOwner {
        mainContractERC1155 = _mainContractERC1155;
    }

    function buyIdWinesFromStock(uint256 id, uint256 amount) public payable {
        uint price = winePrice[id];
        require(tx.origin == msg.sender, "HoldMyWine: only EOA allowed");
        require(
            price > 0,
            "HoldMyWine: incorrect wine id or wine price not set"
        );
        require(
            msg.value == (price * amount) * 1 ether,
            "Not enough found sent to process the transaction"
        );
        ERC1155(mainContractERC1155).safeTransferFrom(
            address(this),
            msg.sender,
            id,
            amount,
            ""
        );
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure override returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }
}
