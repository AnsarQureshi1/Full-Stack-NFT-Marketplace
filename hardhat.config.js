require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    hardhat:{
      chainId: 31337,
    },
    sepolia:{
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    matic: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey:{
        polygonMumbai: "KZZAKCHG8MAQCZUUHHPFQY9NIHH8XRZ71Z"
    }
    
},
};
