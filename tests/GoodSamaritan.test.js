const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers, waffle } = require("hardhat")
const { deploy, log } = deployments

describe("GoodSamaritan Test", () => {
    let goodsamritan,coin, wallet, goodsamritanAttack, deployer, provider, attacker
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]

        await deploy("GoodSamaritan",{
            from:deployer.address,
            args:[]
        })

        await deploy("GoodSamaritanHack",{
            from:attacker.address,
            args:[]
        })


        goodsamritan = await ethers.getContract("GoodSamaritan")
        const coinaddress = (await goodsamritan.coin()).toString()
        const walletaddress = (await goodsamritan.wallet()).toString()
        console.log(coinaddress)
        coin = await ethers.getContractAt("Coin", coinaddress)
        wallet = await ethers.getContractAt("Wallet",walletaddress)
        goodsamritanAttack = await ethers.getContract("GoodSamaritanHack")
    })

    describe("Checks the initialization", ()=>{
        it("Checks the initial balance of the coin", async()=>{
            const balances = await coin.balances(wallet.address)
            assert.equal(balances.toString(), "1000000")
        })
    })
    describe("Let's attack", ()=>{
        it("Attack and drain the account", async()=>{
            await goodsamritanAttack.attack(goodsamritan.address)
            const newBalance = await coin.balances(wallet.address)
            assert.equal(newBalance.toString(),"0") 
        })
    })
})
