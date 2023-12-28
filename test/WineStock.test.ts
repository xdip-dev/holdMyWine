import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { HoldMyWine__factory } from "../typechain-types/factories/contracts/HoldMyWine__factory";
import { WineStock__factory } from "../typechain-types/factories/contracts/WineStock__factory";
import { HelperContractForTest__factory } from "../typechain-types/factories/contracts/HelperContractForTest__factory";
describe("WineStock contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const holdMyWine = await new HoldMyWine__factory(owner).deploy(owner.address);
        const holdMyWineAddress = await holdMyWine.getAddress();
        const wineStock = await new WineStock__factory(owner).deploy();
        await wineStock.initialize(owner.address, holdMyWineAddress);

        const wineStockAddress = await wineStock.getAddress();
        const helperContract = await new HelperContractForTest__factory(owner).deploy(wineStockAddress);
        const wineStockWithOwner = await wineStock.connect(owner);
        return {
            holdMyWine,
            wineStock,
            owner,
            addr1,
            holdMyWineAddress,
            wineStockAddress,
            wineStockWithOwner,
            helperContract,
        };
    }
    async function deployFixtureWithUpdatedPriceAndStock() {
        const data = await deployTokenFixture();
        await data.holdMyWine.connect(data.owner).mint(data.wineStockAddress, 1, 10, "0x");
        await data.wineStock.connect(data.owner).updateBatchWinePrice([1, 2, 3], [10, 20, 10]);
        return { ...data };
    }

    describe("Updating wine price", function () {
        it("Should throw if the lenght are not the same between the ids and prices ", async function () {
            const { wineStockWithOwner } = await loadFixture(deployTokenFixture);
            await expect(wineStockWithOwner.updateBatchWinePrice([1, 2, 3], [10, 20])).to.be.revertedWith(
                "HoldMyWine: incorrect array length to update price"
            );
        });
        it("Should throw be onlyOwner usage ", async function () {
            const { wineStock, addr1 } = await loadFixture(deployTokenFixture);
            await expect(
                wineStock.connect(addr1).updateBatchWinePrice([1, 2, 3], [10, 20, 12])
            ).to.be.revertedWithCustomError(wineStock, "OwnableUnauthorizedAccount");
        });
        it("Should update the price for each ids ", async function () {
            const { wineStockWithOwner } = await loadFixture(deployTokenFixture);
            await wineStockWithOwner.updateBatchWinePrice([1, 2, 3], [10, 20, 10]);
            expect(await wineStockWithOwner.getWinePrice(1)).to.equal(10);
            expect(await wineStockWithOwner.getWinePrice(2)).to.equal(20);
            expect(await wineStockWithOwner.getWinePrice(3)).to.equal(10);
        });
    });
    describe("Buy Wine from Stock", function () {
        it("should revert if the msg value is not equal to the price * amount requested in ether unit", async function () {
            const { wineStockWithOwner } = await loadFixture(deployFixtureWithUpdatedPriceAndStock);
            await expect(
                wineStockWithOwner.buyIdWinesFromStock(1, 5, { value: ethers.parseEther("1") })
            ).to.be.revertedWith("Not enough found sent to process the transaction");
        });
        it("should revert if the stock doesn't have enough wine", async function () {
            const { wineStockWithOwner, holdMyWine } = await loadFixture(deployFixtureWithUpdatedPriceAndStock);
            await expect(
                wineStockWithOwner.buyIdWinesFromStock(1, 11, { value: ethers.parseEther("110") })
            ).to.be.revertedWithCustomError(holdMyWine, "ERC1155InsufficientBalance");
        });
        it("should revert revert if buying a not set price wine", async function () {
            const { wineStockWithOwner } = await loadFixture(deployFixtureWithUpdatedPriceAndStock);
            await expect(
                wineStockWithOwner.buyIdWinesFromStock(5, 1, { value: ethers.parseEther("10") })
            ).to.be.revertedWith("HoldMyWine: incorrect wine id or wine price not set");
        });

        it("should revert if a contract try to buy wine", async () => {
            const { helperContract } = await loadFixture(deployFixtureWithUpdatedPriceAndStock);
            await expect(
                helperContract.buyIdWinesFromStock(1, 1, { value: ethers.parseEther("10") })
            ).to.be.revertedWith("HoldMyWine: only EOA allowed");
        });
        it("should transfert the token to the customer", async () => {
            const { holdMyWine, addr1, wineStockAddress, wineStock } = await loadFixture(
                deployFixtureWithUpdatedPriceAndStock
            );
            await wineStock.connect(addr1).buyIdWinesFromStock(1, 1, { value: ethers.parseEther("10") });
            expect(await holdMyWine.balanceOf(addr1.address, 1)).to.equal(1);
            expect(await holdMyWine.balanceOf(wineStockAddress, 1)).to.equal(9);
        });
    });
    describe("Withdraw balance", function () {
        it("should withdraw the balance of the contract", async () => {
            const { wineStockWithOwner, wineStockAddress, wineStock, owner, addr1 } = await loadFixture(
                deployFixtureWithUpdatedPriceAndStock
            );

            // Amount of Ether to send to the contract (in wei)
            const amountToSend = ethers.parseEther("1.0"); // 1 Ether for example

            // Sending Ether to the contract from another account
            const tx = {
                to: wineStockAddress,
                value: amountToSend,
            };
            await addr1.sendTransaction(tx);
            await expect(wineStockWithOwner.withdraw())
                .to.emit(wineStock, "Withdrawal")
                .withArgs(owner.address, amountToSend);
        });
        it("should revert if not called by the owner", async () => {
            const { wineStock, addr1 } = await loadFixture(deployFixtureWithUpdatedPriceAndStock);
            await expect(wineStock.connect(addr1).withdraw()).to.be.revertedWithCustomError(
                wineStock,
                "OwnableUnauthorizedAccount"
            );
        });
    });
});
