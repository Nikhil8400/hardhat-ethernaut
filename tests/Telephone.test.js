const { assert } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { deploy } = deployments

describe("Telephone Test", async () => {
    let deployer, hacker, telephone, telephoneAttack
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        hacker = accounts[1]
        const deployTelephone = await deploy("Telephone", {
            from: deployer,
            args: [],
            log: true,
        })
        const deployAttack = await deploy("TelephoneAttack", {
            from: hacker.address,
            args: [deployTelephone.address],
            log: true,
        })
        telephone = await ethers.getContract("Telephone", deployer)
        telephoneAttack = await ethers.getContract("TelephoneAttack", hacker)
        console.log("deployed")
    })

    describe("Check's the owner, change the owner", () => {

        it("checks the owner", async () => {
            const _owner = await telephone.owner()
            assert.equal(_owner, deployer)
        })
        it("Changes owner to hacker", async () => {
            const tx = await telephoneAttack.attack(hacker.address)
            await tx.wait(1)
            const newOwner = await telephone.owner()
            assert.equal(hacker.address, newOwner)
        })
    })
})
