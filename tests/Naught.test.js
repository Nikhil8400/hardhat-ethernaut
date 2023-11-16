const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {

    let naught,naughtAttack, deployer, player, attacker
    beforeEach(async ()=>{
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]
        attacker = accounts[2]

        await deploy("NaughtCoin", {
            from: deployer.address,
            args:[deployer.address]
        })

        await deploy("NaughtAttack",{
            from:attacker.address,
            args:[]
        })
        naught = await ethers.getContract("NaughtCoin")
        naughtAttack = await ethers.getContract("NaughtAttack")
    })
    describe("Let send all money to our account ",async ()=>{
        it("checks the initial balance", async()=>{
            const balance = await naught.balanceOf(deployer.address)
            const realBalance = ethers.utils.parseEther("1000000")
            assert.equal(balance.toString(), realBalance)
        })
        it("Approve the balance..", async()=>{
            const balance = await naught.balanceOf(deployer.address)
            const realBalance = ethers.utils.parseEther("1000000")
            naught.approve(naughtAttack.address ,  realBalance)
            await naughtAttack.attack(naught.address,deployer.address)
            const newBalance = await naught.balanceOf(deployer.address)
            const newContractBalance = await naught.balanceOf(naughtAttack.address)
            assert.equal(newBalance.toString(),"0")
            assert.equal(newContractBalance.toString(), realBalance)
        })
    })

})
