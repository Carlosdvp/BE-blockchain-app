# NFT Marketplace with Off-Chain Auctions

This project implements a gas-efficient NFT marketplace that uses off-chain signatures to enable single-transaction trades between ERC721 tokens and ERC20 tokens. The system consists of a Solidity smart contract for on-chain settlement and a TypeScript/Express backend for managing off-chain listings and bids.

## System Architecture

The marketplace operates through a combination of:

- Smart Contract: Handles signature verification and final trade settlement
- Express Backend: Stores listings and bids in memory, providing REST API endpoints
- Off-chain Signatures: Enables gasless listing creation and bidding

### Workflow

1. NFT owner approves the marketplace contract to transfer their NFT
2. Owner creates and signs a listing with a minimum price
3. Interested buyer approves ERC20 tokens to the marketplace
4. Buyer creates and signs a bid for the auction
5. If owner accepts the bid, they sign an approval
6. Anyone can execute the trade by submitting both signatures to the contract

## Smart Contract

The NFTMarketplace contract is deployed and verified on Sepolia testnet:

- Address: `0x0A20b2ca38771D1CcB5f9D3b924DDf401F7c07e1`
- Network: Sepolia (Chain ID: 11155111)
- [View on Etherscan](https://sepolia.etherscan.io/address/0x0A20b2ca38771D1CcB5f9D3b924DDf401F7c07e1)

### Key Features

- EIP-712 compliant signature verification
- Single-transaction settlement
- Support for any ERC721 and ERC20 tokens
- Gas-optimized operations

## Backend Service

The Express backend provides a RESTful API for managing listings and bids, with all data stored in memory as specified.

### Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd nft-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by copying the example file:
```bash
cp .env.example .env
```

4. Start the service:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm start
```

### API Endpoints

#### Create Listing
```
POST /api/listings

Request Body:
{
    "nftContract": "0x...",
    "tokenId": "1",
    "owner": "0x...",
    "minPrice": "1000000000000000000",
    "signature": "0x..."
}
```

#### Get All Listings
```
GET /api/listings

Response:
{
    "listings": [
        {
            "nftContract": "0x...",
            "tokenId": "1",
            "owner": "0x...",
            "minPrice": "1000000000000000000",
            "signature": "0x...",
            "timestamp": 1234567890
        }
    ]
}
```

#### Create Bid
```
POST /api/listings/:nftContract/:tokenId/bids

Request Body:
{
    "bidder": "0x...",
    "amount": "1000000000000000000",
    "paymentToken": "0x...",
    "signature": "0x..."
}
```

#### Get Bids for Listing
```
GET /api/listings/:nftContract/:tokenId/bids

Response:
{
    "bids": [
        {
            "bidder": "0x...",
            "amount": "1000000000000000000",
            "paymentToken": "0x...",
            "signature": "0x...",
            "timestamp": 1234567890
        }
    ]
}
```

### Environment Variables

The following environment variables are required:

```
PORT=3000                   # Server port
HOST=localhost              # Server host
MARKETPLACE_CONTRACT_ADDRESS=0x0A20b2ca38771D1CcB5f9D3b924DDf401F7c07e1
CHAIN_ID=11155111          # Sepolia testnet
NETWORK=sepolia            # Network name
```

## Development

### Running Tests

The project includes both smart contract tests (using Foundry) and backend integration tests:

```bash
# Run smart contract tests
forge test

# Run backend integration tests
npm run test:integration
```

### Project Structure

```
├── backend/                    # Backend application root
│   ├── abi/                    # Contract ABI definitions
│   │   └── NFTMarketplace.ts
│   ├── config/                 # Configuration files
│   │   └── deployment.ts
│   ├── controllers/            # API endpoint handlers
│   │   ├── baseController.ts
│   │   ├── bidController.ts
│   │   └── listingController.ts
│   ├── deployments/            # Deployment artifacts
│   │   └── sepolia-deployment.json
│   ├── routes/                 # Express route definitions
│   │   ├── baseRoutes.ts
│   │   ├── bidRoutes.ts
│   │   └── listingRoutes.ts
│   ├── scripts/                # Helper scripts
│   │   └── integrationTest.ts
│   ├── services/               # Business logic services
│   │   └── contractService.ts
│   ├── app.ts                  # Express application setup
│   ├── index.ts                # Application entry point
│   ├── storage.ts              # In-memory storage implementation
│   ├── tsconfig.json           # TypeScript configuration
│   ├── types.ts                # Type definitions
│   └── package.json            # Backend dependencies
```

## Security Considerations

- All signatures are verified using EIP-712 for improved security
- Contract prevents signature reuse through proper hash construction
- Backend implements basic request validation and error handling
- In-memory storage is cleaned up periodically to prevent memory leaks
