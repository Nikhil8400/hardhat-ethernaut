const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers, waffle } = require("hardhat")
const { deploy, log } = deployments

describe("Force Test", () => {
    let force, attackForce, deployer, provider, player
    beforeEach(async () => {
        provider = waffle.provider
        const accounts = await ethers.getSigners()
        player = accounts[1]
        deployer = (await getNamedAccounts()).deployer
        const depforce = await deploy("Force", {
            from: deployer,
            args: [],
        })
        const deployattack = await deploy("ForceAttack", {
            from: deployer,
            args: [],
        })
        force = await ethers.getContract("Force")
        attackForce = await ethers.getContract("ForceAttack")
    })
    describe("Contract Initialization", async () => {
        it("checks the contract balance", async () => {
            const balance = await provider.getBalance(force.address)
            assert.equal(balance.toString(), 0)
        })
        it(" Force the balance to the contract", async () => {
            await player.sendTransaction({
                to: attackForce.address,
                value: ethers.utils.parseEther("1"),
            })
            const tx = await attackForce.close(force.address)
            await tx.wait(1)
            const balance = await provider.getBalance(force.address)
            assert(balance>0)
        })
    })
})
