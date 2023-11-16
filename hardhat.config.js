/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("dotenv").config()

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
    },

    solidity: {
        compilers: [
            { version: "0.8.7" },
            { version: "0.4.19" },
            { version: "0.6.12" },
            { version: "0.6.0" },
            { version: "0.5.0" },
        ],
        overrides: {
            "contracts/Fallout.sol": {
                version: "0.6.0",
            },
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        hacker: {
            default: 1,
        },
    },
    mocha: {
        timeout: 200000, //this is gonna be 200 sec max// we are using it in promise
    },
}
