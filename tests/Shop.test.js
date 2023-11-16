const { ethers, deployments, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("Reentrance Test", () => {
    let deployer, hacker, shop, shopAttack

    beforeEach(async () => {
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        hacker = accounts[1]

        const deployShop  =  await deploy("Shop",{
            from: deployer.address,
            args:[]
        })
        await deploy("ShopAttack", {
            from: hacker.address,
            args:[deployShop.address]
        })
        shop = await ethers.getContract("Shop")
        shopAttack = await ethers.getContract("ShopAttack")
    })
    describe("Let's hack it", ()=>{
        it("Let's shop it for 0", async()=>{
            await shopAttack.attack();
            const issold = await shop.isSold();
            assert(issold)
        })
    })
})
