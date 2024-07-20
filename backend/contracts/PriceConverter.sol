// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        // Since we r interacting with the instance out of the project, we need
        // ABI
        // Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306 (we r creating this contract so it works on sepoliaEth)

        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );
        //We r assuming the contract at this address is going to have all the functionality of Aggregator
        // (uint80 roundId, int price, uint startedAt, uint timeStamp, uint80 answeredInRound ) = priceFeed.latestRoundData(); // The variables in the rackets r the ones to nbe returned by the latestRoundData() function. However, we prioritize to only find thw price so change the line to
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // latestRoundData() is a func in the imported contract
        // This is gonna be price of ETH in USD
        return uint256(price * 1e10); //Typecasted
    }

    // function getVersion() internal view {
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(
    //         0x694AA1769357215DE4FAC081bf1f309aDC325306
    //     );
    //     priceFeed.version(); //version() is a function in the imported contract
    // }

    function getConversionRate(uint ethAmount, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}