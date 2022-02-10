import { ethers } from "hardhat";
import { expect } from "chai";
import { Greeter, Greeter__factory } from "../typechain";

describe("Greeter", function () {
    it("Should return the new greeting once it's changed", async function () {
        const greeterFactory = (await ethers.getContractFactory("Greeter")) as Greeter__factory;
        const greeter = (await greeterFactory.deploy("Hello, world!")) as Greeter;
        await greeter.deployed();

        expect(await greeter.greet()).to.equal("Hello, world!");

        await greeter.setGreeting("Hola, mundo!");

        expect(await greeter.greet()).to.equal("Hola, mundo!");
    });
});
