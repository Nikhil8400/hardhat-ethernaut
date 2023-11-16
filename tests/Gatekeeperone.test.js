const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers, waffle } = require("hardhat")
const { deploy, log } = deployments

describe("GatekeeperOne Test", () => {
    let gatekeeperOne, gatekeeperOneAttack, deployer, provider, player
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]
        await deploy("GatekeeperOne", {
            from: deployer.address,
            args: [],
        })
        await deploy("GatekeeperOneAttack", {
            from: player.address,
            args: [],
        })
        gatekeeperOne = await ethers.getContract("GatekeeperOne")
        gatekeeperOneAttack = await ethers.getContract("GatekeeperOneAttack")
    })
    describe("Let's try to do it", async () => {
        var gas 
        it("Let's Find the required gas", async () => {
            

            const gatekeeperAttack = await gatekeeperOneAttack.connect(player)
            for (var i=0; i < 8191; i++) {
                try {
                    await gatekeeperAttack.attack(gatekeeperOne.address, i)
                    console.log("gas",i)
                    gas = i
                    return
                } catch {}
            }

        })
        it("Lets enter", async()=>{
            const gatekeeperAttack = await gatekeeperOneAttack.connect(player)
            await gatekeeperAttack.attack(gatekeeperOne.address, gas)
            const isentered = gatekeeperOne.entrant()
            assert(isentered)
        })
    })
})
