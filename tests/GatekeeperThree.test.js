const { assert } = require("chai")
const { deployments, getNamedAccounts, ethers, waffle } = require("hardhat")
const { deploy, log } = deployments

describe("GatekeeperOThree Test", () => {
    let gatekeeperThree, gatekeeperThreeAttack, deployer, provider, player
    beforeEach(async () => {
        provider = waffle.provider
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]

        await deploy("GatekeeperThree", {
            from: deployer.address,
            args: [],
        })
        gatekeeperThree = await ethers.getContract("GatekeeperThree")
        await deploy("HackGatekeeper", {
            from: player.address,
            args: [gatekeeperThree.address],
        })
        gatekeeperThreeAttack = await ethers.getContract("HackGatekeeper")
    })
    describe("Check's the initialization", () => {
        it("Checks  entrant", async () => {
            const entrnt = await gatekeeperThree.entrant()
            assert.equal(
                entrnt.toString(),
                "0x0000000000000000000000000000000000000000"
            )
        })
    })
    describe("let's try to attack", () => {
        it("Attack", async () => {
            await deployer.sendTransaction({
                to: gatekeeperThree.address,
                value: ethers.utils.parseEther("0.005"),
            })

            const addre = (await gatekeeperThreeAttack.getAddress()).toString()
            const pass = (await provider.getStorageAt(addre, 2)).toString()
            await gatekeeperThreeAttack.hackIt(pass)

            const entrant = (await gatekeeperThree.entrant()).toString()
            assert.equal(entrant, deployer.address)
        })
    })
})
