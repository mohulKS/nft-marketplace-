import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.4",
    networks: {
        // polygon: {
        //     url: "https://polygon-rpc.com/",
        //     accounts: [process.env.PRIVATE_KEY as string],
        //     gasPrice: "auto", // if txs failing, set manual fast gas price
        // },
        // mumbai: {
        //     url: "https://rpc-mumbai.maticvigil.com",
        //     accounts: [process.env.PRIVATE_KEY as string],
        //     gasPrice: "auto",
        // },
    },
    // even if verifying on polygonscan, property name should be etherscan only, only apiKey should change
    etherscan: {
        apiKey: process.env.EXPLORER_API_KEY || "",
    },
};

export default config;
