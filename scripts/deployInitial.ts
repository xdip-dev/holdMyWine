import { ethers, network, upgrades } from "hardhat";
import { deployementByChainId } from "../utils/deployement";
import { HoldMyWine__factory } from "../typechain-types/factories/contracts/HoldMyWine__factory";
import { WineStock__factory } from "../typechain-types";
async function main() {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const holdMyWine = await new HoldMyWine__factory(owner).deploy(owner.address);

    await holdMyWine.waitForDeployment();
    const holdMyWineAddress = await holdMyWine.getAddress();

    console.log(`holdMyWine deployed to: ${holdMyWineAddress} with owner ${await holdMyWine.owner()}`);

    const wineStockProxy = await upgrades.deployProxy(
        await ethers.getContractFactory("WineStock"),
        [owner.address, holdMyWineAddress],
        {
            kind: "uups",
        }
    );

    await wineStockProxy.waitForDeployment();

    const wineStockProxyAddress = await wineStockProxy.getAddress();

    console.log(`wineStockProxy deployed to: ${wineStockProxyAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
