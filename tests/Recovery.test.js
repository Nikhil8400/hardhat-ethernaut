const { ethers, deployments, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {
    let recovery, recover, simpleToken, deployer, player, attacker

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]
        attacker = accounts[2]

        await deploy("Recovery", {
            from: deployer.address,
            args: [],
        })
        await deploy("Recover", {
            from: player.address,
            args: [],
        })
        await deploy("SimpleToken", {
            from: deployer.address,
            args:["rpp",deployer.address ,"100000000000000000000"]
        })

        recovery = await ethers.getContract("Recovery")
        recover = await ethers.getContract("Recover")
        simpleToken = await ethers.getContract("SimpleToken")

        // simpleToken = await ethers.getContract("SimpleToken")
        // await simpleToken.receive({value: ethers.utils.parseEther("0.001")})
    })
    describe("Checks the initialization", () => {
        it("checks the contract balance", async () => {
        const tx = await recover.recover(deployer.address)
        console.log(`This is real address${simpleToken.address}`)
        console.log(`This is maked address${tx}`)
        assert.equal(simpleToken.address,tx)
        })
    })
})
