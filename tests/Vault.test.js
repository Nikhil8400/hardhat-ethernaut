const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { deploy } = deployments
const {assert} = require("chai")

describe("Vault Test", () => {
    let hacker, deployer, vault
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        hacker = accounts[1]
        const passwordBytes32 = ethers.utils.formatBytes32String("password");
        

        await deploy("Vault", {
            from: deployer,
            args: [passwordBytes32],
        })
        vault = await ethers.getContract("Vault")
    })
    describe("Check initializtion", () => {
        it("Checks the vault is lock", async () => {
            console.log(`Vault address is ${vault.address}`)
            const locker = await vault.locked()
            assert(locker)
        })
    })
    describe("Lest find pass, and attack", async () => {
        it("Lest Unlock", async () => {
            const password = await ethers.provider.getStorageAt(
                vault.address,
                1
            )
            await vault.unlock(password)
            const isLocked = await vault.locked()
            console.log(`Is the locker locked ${isLocked}`)
            assert(!isLocked)
        })
    })
})
