const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers, waffle } = require("hardhat")
const { deploy, log } = deployments

describe("GatekeeperTwo Test", () => {
    let gatekeeperTwo, gatekeeperTwoAttack, deployer, provider, attacker
    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]

        await deploy("GatekeeperTwo", {
            from: deployer.address,
            args: [],
        })
        gatekeeperTwo = await ethers.getContract("GatekeeperTwo")
    })
    describe("Check's the initialization", () => {
        it("check's no one entered yet", async () => {
            const entrant = await gatekeeperTwo.entrant()
            assert.equal(entrant.toString(), 0)
        })

        describe("Let's pass the gate's", async () => {
            it("pass it", async () => {
                const attack = await deploy("GatekeeperTwoAttack", {
                    from: attacker.address,
                    args: [gatekeeperTwo.address],
                    gasLimit:"8000000"
                })
                const entrant = await gatekeeperTwo.entrant()
                assert.equal(entrant.toString(), attacker.address)
            })
        })
    })
})
