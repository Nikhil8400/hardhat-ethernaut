const { ethers, deployments, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("Reentrance Test", () => {
    let deployer, hacker, reentrance, attackReentrance, provider

    beforeEach(async () => {
        provider = waffle.provider
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        hacker = accounts[1]

        const deployReentrance = await deploy("Reentrance", {
            from: deployer.address,
            args: [],
        })
        await deploy("ReentrancyAttack", {
            from: hacker.address,
            args: [deployReentrance.address],
        })
        reentrance = await ethers.getContract("Reentrance")
        attackReentrance = await ethers.getContract("ReentrancyAttack")
    })
    describe("Initialization", async () => {
        it("Fund some balance to contract", async () => {
            const fund = ethers.utils.parseEther("0.005")
            await deployer.sendTransaction({
                to: reentrance.address,
                value: fund,
            })
            const balance = await provider.getBalance(reentrance.address)
            assert.equal(balance.toString(), fund)
        })
    describe("Let's attack", ()=>{
        it("Fund attack contract", async()=>{
            const fund = ethers.utils.parseEther("0.005")
            await hacker.sendTransaction({
                to:attackReentrance.address,
                value: fund,
            })
            const balance = await provider.getBalance(attackReentrance.address)
            assert.equal(balance.toString(), fund)
        })
        it("Final Attack", async()=>{
            const fund = ethers.utils.parseEther("0.005")
            const attack = await attackReentrance.fund({value: fund})
            await attack.wait(1)
            const newBalance = await provider.getBalance(reentrance.address)
            assert.equal(newBalance.toString(), 0)
        })
    })
    })
})
