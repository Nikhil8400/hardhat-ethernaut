const { ethers, getNamedAccounts, deployments } = require("hardhat")
const { deploy, log } = deployments
const { assert } = require("chai")

describe("Elevator Test", () => {
    let elevator, attackElevator, deployer, hacker
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        hacker = accounts[1]

        const deployElevator = await deploy("Elevator", {
            from: deployer.address,
            args: [],
        })
        await deploy("AttackElevator", {
            from: hacker.address,
            args: [deployElevator.address],
        })
        elevator = await ethers.getContract("Elevator")
        attackElevator = await ethers.getContract("AttackElevator")
    })

    describe("Initialization is correct?", ()=>{
        it("Checks if top is false?", async()=>{
            const top = await elevator.top()
            assert(!top)
        })
    })
    describe("Let's Go to the top..!!",()=>{
        it("Attack", async()=>{
            const tx = await attackElevator.attack()
            await tx.wait(1)
            const top = await elevator.top()
            assert(top)
        })
    })
})
