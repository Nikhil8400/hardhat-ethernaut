const { getNamedAccounts, ethers, deployments } = require("hardhat")
const {tokenSupply,hackerAmount} = require("../helper-hardhat-config")
const {deploy} = deployments
const {assert} = require("chai")

//I have added an additional function in Token.sol to check the balance of any address 

describe("Token Test",async()=>{
    let deployer, hacker, token, player
    beforeEach(async()=>{
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        hacker = accounts[1]
        player = accounts[2]
        const deployToken = await deploy("Token", {
            from:deployer,
            args:[tokenSupply],
            log:true
        })
        token = await ethers.getContract("Token", deployer)
    })
    describe("Initially everything is set",()=>{
        it("Deployer send some token's to the hacker", async()=>{
            await token.transfer(hacker.address,"20")
            const hackerContract = await token.connect(hacker)
            const bal = await hackerContract.balance()
            assert.equal(bal.toString(),"20")
        })
        it("Hacking", async ()=>{
            const hackerContract = await token.connect(hacker)
            await hackerContract.transfer(player.address,hackerAmount)
            const hackerBalance = await hackerContract.balance()
            assert(hackerBalance>1000000000)
        })
    })
})