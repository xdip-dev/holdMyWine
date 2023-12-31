

async function attachContracts() {
    const Contract1 = await ethers.getContractFactory("HoldMyWine");
    const holdMyWine = await Contract1.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    const Contract2 = await ethers.getContractFactory("WineStock");
    const wineStockProxy = await Contract2.attach("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0");

    

    return { holdMyWine, wineStockProxy };
}

module.exports = attachContracts;

// const attachContracts = require("./scripts/attachContracts.js");
// const { holdMyWine, wineStockProxy } = await attachContracts();