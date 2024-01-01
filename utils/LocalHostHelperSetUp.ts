import { ethers } from "hardhat";

export async function helper() {
    /*
    mainly used to have pre made line for the console in localhost
    */
    const Contract1 = await ethers.getContractFactory("HoldMyWine");
    const holdMyWine = await Contract1.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const Contract2 = await ethers.getContractFactory("WineStock");
    const wineStockProxy = await Contract2.attach("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0");
    const [owner, addr1, addr2] = await ethers.getSigners();
    // await wineStockProxy.connect(owner).updateBatchWinePrice([1, 2, 3],[ethers.parseEther("10"), ethers.parseEther("20"), ethers.parseEther("30")]);
    // await holdMyWine.connect(owner).mintBatch("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",[1,2,3],[10,12,15],"0x")

    return { holdMyWine, wineStockProxy };
}
