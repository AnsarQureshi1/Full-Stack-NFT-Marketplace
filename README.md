# Full Stack NFT Marketplace

This is a full stack NFT marketplace where users can buy and sell non-fungible tokens (NFTs). The marketplace is built using the Hardhat framework for smart contracts written in Solidity. The NFT data is stored using the Pinata IPFS service, and the frontend is developed using React.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Hardhat
- React

## Installation

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```
   cd full-stack-nft-marketplace
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Set up your Pinata API credentials. Create a `.env` file in the project root and add the following:

   ```
   PINATA_API_KEY=<your_pinata_api_key>
   PINATA_API_SECRET=<your_pinata_api_secret>
   ```

## Usage

### Smart Contracts

1. Compile the smart contracts:

   ```
   npx hardhat compile
   ```

2. Run the local development network:

   ```
   npx hardhat node
   ```

3. Deploy the smart contracts to the local development network:

   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. Take note of the deployed contract addresses.

### IPFS Integration

The NFT metadata is stored on the IPFS network using the Pinata service.

1. Make sure you have valid Pinata API credentials set in the `.env` file.

2. To upload an NFT metadata file to IPFS, use the following command:

   ```
   npx hardhat run scripts/upload.js --network localhost --file <path_to_metadata_file>
   ```

   Replace `<path_to_metadata_file>` with the path to your NFT metadata file.

   The script will return the IPFS CID (content identifier) of the uploaded file. Make a note of this CID for future reference.

### Frontend

1. Navigate to the frontend directory:

   ```
   cd client
   ```

2. Install the frontend dependencies:

   ```
   npm install
   ```

3. Update the contract addresses:

   Open the `src/utils/constants.js` file and replace the values of `CONTRACT_ADDRESS` with the addresses of the deployed smart contracts.

4. Start the React development server:

   ```
   npm start
   ```

5. Open your browser and access the marketplace at `http://localhost:3000`.

## Features

- Buy , Resell and sell NFTs
- View NFT details, including metadata and owner information
- Wallet integration for managing funds and transactions

## Contributing

Contributions are welcome! If you find any issues or have ideas for improvement, please submit an issue or a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Hardhat: [https://hardhat.org/](https://hardhat.org/)
- Pinata: [https://pinata.cloud/](https://pinata.cloud/)
- React: [https://reactjs.org/](https://reactjs.org/)
