// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
//     // This is the same as hre.getNamedAccounts and hre.deployments.
//     // So lets just put them as arguments of the function instead of hre

// }
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")
//  Its the same as:
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // Now we create a mock. It's cuz if the contract doesn't exist, we deploy a minimal version of it for our local testing

    // when going for localhost or hardhat network we want to use a mock

    // deploy("our contract name", list of overrides)

    log("Deploying FundMe contract...")

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //List of arguments. We put pricefeed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name)&& process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
    log("-------------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]

// npx hardhat node
