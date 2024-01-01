import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        localhost: {
            chainId: 1337,
        },
        mumbai: {
            url: process.env.ALCHEMY_RPC_API_KEY,
            accounts: [process.env.PRIVATE_KEY!],
            chainId: 80001,
        },
    },
    etherscan: {
        apiKey: process.env.PLOYGONE_API_KEY,
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;
