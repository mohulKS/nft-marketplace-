import { ethers } from "hardhat";
import { Greeter, Greeter__factory } from "../typechain";

async function main() {
    const greeterFactory = (await ethers.getContractFactory("Greeter")) as Greeter__factory;

    const greeter = (await greeterFactory.deploy("Hello, Hardhat!")) as Greeter;

    await greeter.deployed(); // this waits for tx to be mined

    console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
