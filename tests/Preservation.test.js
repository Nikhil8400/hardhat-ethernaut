const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("King Test", () => {
    let preservation, preservationAttack, deployer, player, attacker,libraryContract
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]
        attacker = accounts[2]

        libraryContract = await deploy("LibraryContract",{
            from: deployer.address,
            args: [],
        })

  
    
        await deploy("Preservation", {
            from: deployer.address,
            args: [libraryContract.address, libraryContract.address],
        })
        await deploy("PreservationAttack",{
            from: attacker.address,
            args:[]
        })
        preservation = await ethers.getContract("Preservation")
        preservationAttack = await ethers.getContract("PreservationAttack")
    })
    describe("Initialization Check", ()=>{
        it("Owner", async()=>{
            const Owner = await preservation.owner()
            const timeZone1Library = await preservation.timeZone1Library()
            assert.equal(Owner.toString(), deployer.address)
            console.log(`$Initial time zone library address ${timeZone1Library}`)
            assert.equal(timeZone1Library.toString(), libraryContract.address)
        })
    describe("Attack to the contract", async()=>{
        it("Changes the timeZone1Library variable to attack contract address, and changes the owner to hacker", async()=>{
            const preservationAttackHacker = await preservationAttack.connect(attacker) 
            await preservationAttackHacker.attack(preservation.address)
            const newOwner = await preservation.owner()
            const timeZone1Library = await preservation.timeZone1Library()
            assert.equal(newOwner.toString(), attacker.address)
            assert.equal(timeZone1Library.toString(),preservation.address)
        })
    })
    })
})
