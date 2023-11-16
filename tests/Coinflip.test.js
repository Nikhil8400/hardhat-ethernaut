const { equal } = require("assert")
const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { deploy, log } = deployments

describe("Coinflip Tests", () => {
    let coinflip, coinAttack, deployer, hacker

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        hacker = accounts[1]
        const coinflipDeploy = await deploy("CoinFlip", {
            from: deployer,
            args: [],
            log: true,
        })
        const coinAttackDeploy = await deploy("CoinflipAttack", {
            from: hacker.address,
            args: [coinflipDeploy.address],
            log: true,
        })
        coinflip = await ethers.getContract("CoinFlip", deployer)
        coinAttack = await ethers.getContract("CoinflipAttack", hacker)
    })

    describe("Contracts are deployed Correctly", () => {
        it("Checks the contract address", async () => {
            expect(coinflip.address).to.not.equal(0)
            expect(coinAttack.address).to.not.equal(0)
        })
    })
    describe("Become a words best gambler", () => {
        it("Initially the win is 0",async()=>{
            const consecutiveWin = (await coinflip.consecutiveWins()).toString()
            assert.equal(consecutiveWin, "0")
        })
        it("Lets win the game", async () => {
            for (var i = 0; i < 11; i++) {
                const tx = await coinAttack.attack()
            }
            const consecutiveWin = (await coinflip.consecutiveWins()).toString()
            assert(consecutiveWin>=10)
        })
    })
})
