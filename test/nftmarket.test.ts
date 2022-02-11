import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer, BigNumber } from "ethers";
import { NFT, NFTMarket, NFT__factory, NFTMarket__factory } from "../typechain";
import { parse } from "path/posix";
import { isTypedArray } from "util/types";
const { parseEther } = ethers.utils;

describe("NFTMarket tests", () => {
    let nft: NFT, nftMarket: NFTMarket;
    let NFT: NFT__factory, NFTMARKET: NFTMarket__factory;
    let adminSigner: Signer,
        aliceSigner: Signer,
        bobSigner: Signer,
        admin: string,
        alice: string,
        bob: string;

    before(async () => {
        NFTMARKET = (await ethers.getContractFactory("NFTMarket")) as NFTMarket__factory;
        NFT = (await ethers.getContractFactory("NFT")) as NFT__factory;
    });

    beforeEach(async () => {
        [adminSigner, aliceSigner, bobSigner] = await ethers.getSigners();
        admin = await adminSigner.getAddress();
        alice = await aliceSigner.getAddress();
        bob = await bobSigner.getAddress();
        nftMarket = await NFTMARKET.deploy();
        nft = await NFT.deploy(nftMarket.address);
    });

    describe("Creating Market Item", () => {
        it("user tries to create a market item with price 0", async () => {
            const nftContractaddress = nft.address;
            await nft.createToken("https://www.tokenlocation.com");
            await expect(
                nftMarket
                    .connect(aliceSigner)
                    .createMarketItem(nftContractaddress, 1, 0, { value: parseEther("0.025") })
            ).to.be.revertedWith("Price must be atleast more than 0");
        });
        it("user tries to create a market item with listing price not equal to 0.025", async () => {
            const nftContractaddress = nft.address;
            await nft.createToken("https://www.tokenlocation.com");
            await expect(
                nftMarket
                    .connect(aliceSigner)
                    .createMarketItem(nftContractaddress, 1, 0, { value: parseEther("0.020") })
            ).to.be.revertedWith("Price must be atleast more than 0");
        });
        it("creates a market item", async () => {
            const nftContractaddress = nft.address;
            await nft.createToken("https://www.tokenlocation.com");
            await nftMarket.createMarketItem(nftContractaddress, 1, 100, { value: parseEther("0.025") });
        });
    });
    describe("Creating Market Sale", () => {
        it("tries to buy an item with unequal price", async () => {
            const nftContractaddress = nft.address;
            const price1 = ethers.utils.parseUnits("100", "ether");
            await nft.connect(aliceSigner).createToken("https://www.tokenlocation.com");
            await nftMarket
                .connect(aliceSigner)
                .createMarketItem(nftContractaddress, 1, price1, { value: parseEther("0.025") });
            await expect((await nftMarket.ownerNFT(1)).toString()).eq(
                "0x0000000000000000000000000000000000000000"
            );
            await expect(
                nftMarket.connect(bobSigner).createMarketSale(nftContractaddress, 1, {
                    value: ethers.utils.parseUnits("90", "ether"),
                })
            ).to.be.revertedWith("Please submit the asking price in order to purchase the item");
            //await expect((await nftMarket.ownerNFT(1)).toString()).eq((await bobSigner.getAddress()).toString());
        });
        it("Buying an item and the ownership is transfered", async () => {
            const nftContractaddress = nft.address;
            const price1 = ethers.utils.parseUnits("100", "ether");
            await nft.connect(aliceSigner).createToken("https://www.tokenlocation.com");
            await nftMarket
                .connect(aliceSigner)
                .createMarketItem(nftContractaddress, 1, price1, { value: parseEther("0.025") });
            await expect((await nftMarket.ownerNFT(1)).toString()).eq(
                "0x0000000000000000000000000000000000000000"
            );
            await nftMarket.connect(bobSigner).createMarketSale(nftContractaddress, 1, { value: price1 });
            await expect((await nftMarket.ownerNFT(1)).toString()).eq(
                (await bobSigner.getAddress()).toString()
            );
        });
    });
    describe("fetching NFTS", () => {
        it("fetches nfts of alice and nfts present in market", async () => {
            const nftContractaddress = nft.address;
            await nft.createToken("https://www.tokenlocation.com");
            await nft.createToken("https://www.tokenlocation2.com");
            await nft.createToken("https://www.tokenlocation3.com");
            const price1 = ethers.utils.parseUnits("50", "ether");
            const price2 = ethers.utils.parseUnits("60", "ether");
            const price3 = ethers.utils.parseUnits("70", "ether");
            await nftMarket.createMarketItem(nftContractaddress, 1, price1, { value: parseEther("0.025") });
            await nftMarket.createMarketItem(nftContractaddress, 2, price2, { value: parseEther("0.025") });
            await nftMarket.createMarketItem(nftContractaddress, 3, price3, { value: parseEther("0.025") });
            await nftMarket
                .connect(aliceSigner)
                .createMarketSale(nftContractaddress, 1, { value: ethers.utils.parseUnits("50", "ether") });
            await nftMarket
                .connect(aliceSigner)
                .createMarketSale(nftContractaddress, 2, { value: ethers.utils.parseUnits("60", "ether") });
            const items = await nftMarket.connect(aliceSigner).fetchMyNFTs();
            console.log("These are nfts of alice: ", items);
            const itemsMarket = await nftMarket.fetchMarketItems();
            console.log("These are nfts present in market unsold: ", itemsMarket);
        });
        it("fetches items that are created by a user", async () => {
            const nftContractaddress = nft.address;
            await nft.connect(aliceSigner).createToken("https://www.tokenlocation.com");
            await nft.connect(aliceSigner).createToken("https://www.tokenlocation2.com");
            await nft.connect(aliceSigner).createToken("https://www.tokenlocation3.com");
            const price1 = ethers.utils.parseUnits("50", "ether");
            const price2 = ethers.utils.parseUnits("60", "ether");
            const price3 = ethers.utils.parseUnits("70", "ether");
            await nftMarket
                .connect(aliceSigner)
                .createMarketItem(nftContractaddress, 1, price1, { value: parseEther("0.025") });
            await nftMarket
                .connect(aliceSigner)
                .createMarketItem(nftContractaddress, 2, price2, { value: parseEther("0.025") });
            await nftMarket
                .connect(aliceSigner)
                .createMarketItem(nftContractaddress, 3, price3, { value: parseEther("0.025") });
            const items = await nftMarket.connect(aliceSigner).fetchItemsCreated();
            console.log("Items created by alice: ", items);
        });
    });
});
