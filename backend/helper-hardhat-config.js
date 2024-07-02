const networkConfig = {
    11155111: {
        //chainId of sepolia
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    },
}

const developmentChains = ["hardhat", "localhost"] //List of chains that r only allowed to be deployed in
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
    developmentChains,
    networkConfig,
    DECIMALS,
    INITIAL_ANSWER,
}