// import
// node.js ==> require()
// javascript ==> import
// import { ethers } from "ethers";
import { ethers } from "/ethers-5.6.esm.min.js"
// import {ethers} from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = updateBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected!"
            showNotification("Connected Successfully!")
        } catch (error) {
            console.log(error)
            showNotification("Connection failed!")
        }
        // document.getElementById("connectButton").innerHTML = "Connected!"
    } else {
        // document.getElementById("connectButton").innerHTML ="Please install metamask!"
        connectButton.innerHTML = "Please install a metamask! "
        showNotification("Please install Metamask!")
    }
}

// balance function
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`Current balance: ${ethers.utils.formatEther(balance)}`)
        return ethers.utils.formatEther(balance)
    } else {
        return "0"
    }
}

// fund function
async function fund(ethAmount) {
    ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //What are the things we need to send a transaction
        // 1. Provider/ connection to te blockchain
        // 2. signer/ wallet/ someone with some gas
        //3.contract that we are interacting with
        //4.ABI & addess of the contract ==> ABI is from hardhat-fund-me>artifacts>contracts>FundMe.json>abi code
        // address could be an address from hardhat local network (npx hardhat node in hardhat-fund-me directory) and grab the address deployed at and paste it in constants.js

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the transaction to be mined --> listenForTransactionToBeMined()
            // listed for an event
            await listenForTransactionToBeMined(transactionResponse, provider)
            console.log("Done!")
            showNotification(`Successfully funded ${ethAmount} ETH!`)
            await updateBalance()
        } catch (error) {
            console.log(error)
            showNotification("Funding Failed!")
        }
    } else {
        showNotification("Ethereum provider not found")
    }
}
function listenForTransactionToBeMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            resolve()
        })
    })
    // The reason we return a promise cuz we need to create a listener for the blockchain and listen for this transaction to finish
}
// withdraw function
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionToBeMined(transactionResponse, provider)
            console.log("Withdrawal successful")
            showNotification("Withdrawal successful!")
            await updateBalance()
        } catch (error) {
            console.log(error)
            showNotification("Withdrawal failed!")
        }
    } else {
        showNotification("Ethereum provider not found")
    }
}

// Update the displayed balance
async function updateBalance() {
    try {
        const balance = await getBalance()
        // document.getElementById("balanceDisplay").innerText =
        //     `Balance: ${balance} ETH`
        await getBalance()
        showNotification(`Current balance: ${balance} ETH`)
    } catch (error) {
        console.log("Failed to get balance:", error)
        showNotification("Failed to get balance!")
    }
}


// Function to show a notification message
function showNotification(message) {
    const notification = document.getElementById("notification")
    notification.innerText = message
    notification.classList.remove("hidden")
    notification.classList.add("visible")
    setTimeout(() => {
        notification.classList.remove("visible")
        notification.classList.add("hidden")
    }, 3000) // Hide after 3 seconds
}

// Initial balance update
updateBalance()
