import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HoldMyWine__factory } from "../typechain-types/factories/contracts/HoldMyWine__factory";

describe("HoldMyWine contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const holdMyWine = await new HoldMyWine__factory(owner).deploy(owner.address);
        const holdMyWineAddress = await holdMyWine.getAddress();
        const holdMyWineWithOwner = await holdMyWine.connect(owner);
        // Fixtures can return anything you consider useful for your tests
        return { holdMyWine, holdMyWineWithOwner, owner, addr1, holdMyWineAddress };
    }
    // describe("Updating wine price", function () {
    //     it("Should throw if the lenght are not the same between the ids and prices ", async function () {
    //         const { holdMyWineWithOwner } = await loadFixture(deployTokenFixture);
    //         await expect(holdMyWineWithOwner.updateBatchWinePrice([1, 2, 3], [10, 20])).to.be.revertedWith(
    //             "HoldMyWine: incorrect array length to update price"
    //         );
    //     });
    //     it("Should throw be onlyOwner usage ", async function () {
    //         const { holdMyWine, addr1 } = await loadFixture(deployTokenFixture);
    //         await expect(
    //             holdMyWine.connect(addr1).updateBatchWinePrice([1, 2, 3], [10, 20, 12])
    //         ).to.be.revertedWithCustomError(holdMyWine, "OwnableUnauthorizedAccount");
    //     });
    //     it("Should update the price for each ids ", async function () {
    //         const { holdMyWineWithOwner } = await loadFixture(deployTokenFixture);
    //         await holdMyWineWithOwner.updateBatchWinePrice([1, 2, 3], [10, 20, 10]);
    //         expect(await holdMyWineWithOwner.getWinePrice(1)).to.equal(10);
    //         expect(await holdMyWineWithOwner.getWinePrice(2)).to.equal(20);
    //         expect(await holdMyWineWithOwner.getWinePrice(3)).to.equal(10);
    //     });
    // });
    // describe("Buy Wine from Stock", function () {
    //     it("Should throw if the msg value is not equal to the price * amount requested in ether unit", async function () {
    //         const { holdMyWineWithOwner } = await loadFixture(deployTokenFixture);
    //         await holdMyWineWithOwner.updateBatchWinePrice([1, 2, 3], [10, 20, 10]);
    //         await expect(
    //             holdMyWineWithOwner.buyWinesFromStock(1, 5, { value: ethers.parseEther("1") })
    //         ).to.be.revertedWith("Not enough found sent to process the transaction");
    //     });
    // });
});
