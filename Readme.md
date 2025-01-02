## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
# Technical Design Implementation Steps -- Summary

## Stage 1: Project Setup and Configuration

Stage 1 setup provides us with:

    - A properly configured Foundry environment
    - Essential dependencies
    - Basic contract structure
    - Initial test framework
    - Clean configuration files

The initial structure is minimal but extensible, following best practices while maintaining simplicity. We can now move on to Stage 2 where we'll implement the core smart contract functionality.

## Stage 2: Core Smart Contract Development

- Created core NFTMarketplace contract
- Implemented EIP-712 signature verification
- Added listing and bid structures
- Implemented auction settlement logic
- Created comprehensive test suite
    - Implemented Foundry tests for smart contract
    - Added proper error handling

## Stage 3: Off-chain Backend

Approach for the backend system: We need to create a simple Express.js server that handles listings and bids in memory, following the requirements of not using persistent storage. The server will need to interface with both the blockchain and our frontend users.

Basic server file structure

src/
├── controllers/      # Business logic for handling requests
│   ├── listingController.ts
│   └── bidController.ts
├── routes/          # Route definitions and middleware
│   ├── listingRoutes.ts
│   └── bidRoutes.ts
├── server.ts        # Main Express app configuration
└── types.ts         # Our existing types file

- Established TypeScript/Express project structure
- Implemented in-memory storage system
- Created controller and route organization
- Added signature verification utilities
- Set up proper project architecture
    - Created type-safe Express endpoints
    - Set up development environment

## Stage 4: Testing and Verification

This stage focused on creating comprehensive tests, deploying to Sepolia, and verifying contract functionality.

### Forge deployment command

forge script script/NFTMarketplace.s.sol:NFTMarketplaceScript \
    --rpc-url https://eth-sepolia.g.alchemy.com/v2/IEJ6ax3RNiwZpJ6VHA_3LFgbbDOz3syX \
    --fork-url https://eth-sepolia.g.alchemy.com/v2/IEJ6ax3RNiwZpJ6VHA_3LFgbbDOz3syX \
    --broadcast \
    --verify \
    -vvvv

forge script script/NFTMarketplace.s.sol:NFTMarketplaceScript \
    --rpc-url $SEPOLIA_RPC_URL \
    --sender $DEPLOYER_ADDRESS \
    --private-key $PRIVATE_KEY \
    --broadcast \
    -vvvv

forge script script/NFTMarketplace.s.sol:NFTMarketplaceScript \
    --rpc-url https://eth-sepolia.g.alchemy.com/v2/IEJ6ax3RNiwZpJ6VHA_3LFgbbDOz3syX \
    --fork-url https://eth-sepolia.g.alchemy.com/v2/IEJ6ax3RNiwZpJ6VHA_3LFgbbDOz3syX \
    --sender $DEPLOYER_ADDRESS \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    -vvvv

### Summary for this stage

1. Successfully deployed the contract
2. Got verification working
3. Have a proper contract address for our backend integration



## Stage 5: Documentation and Cleanup

The final stage involves documenting the system, cleaning up code, and preparing for deployment.


--------------------------------------------------------------------------------------------------------------------------

# Progress Report and Remaining Tasks -- latest

We have successfully completed several major milestones in our implementation of the off-chain NFT marketplace system. The most significant achievement has been developing and deploying a secure, gas-efficient smart contract that enables single-transaction trading between ERC721 and ERC20 tokens using off-chain signatures.

Our smart contract implementation features robust signature verification for listings, bids, and owner approvals. This ensures that all parties must cryptographically sign their intentions before any trade can be executed. We've also implemented proper error handling and event emissions for better transaction tracking and user feedback.

The backend infrastructure has been established with a clean architecture that separates concerns effectively. Our Express server uses TypeScript for type safety and includes properly structured routes and controllers. Following the requirements, we've implemented an in-memory storage system that maintains listings and bids without persistent storage.

Most recently, we've achieved a successful deployment to the Sepolia testnet at address 0x0A20b2ca38771D1CcB5f9D3b924DDf401F7c07e1. The contract has been verified on Etherscan, making it transparent and allowing users to interact with it directly through the block explorer.

## Matching Against Original Plan

Let's examine how our progress aligns with our original five-stage plan:

Stage 1: Project Setup and Configuration
✓ Completed
- Established Foundry development environment
- Set up TypeScript/Express backend
- Configured necessary development tools
- Implemented proper project structure

Stage 2: Core Smart Contract Development
✓ Completed
- Implemented NFTMarketplace contract with signature verification
- Added comprehensive test suite
- Successfully deployed to Sepolia
- Contract verified on Etherscan

Stage 3: Off-chain Backend Implementation
⚠️ Partially Complete
- Basic server structure implemented
- In-memory storage system created
- Routes and controllers established
- Still needs integration testing with deployed contract

Stage 4: Testing and Verification
⚠️ In Progress
- Smart contract tests completed
- Contract verification successful
- Integration tests pending
- End-to-end testing pending

Stage 5: Documentation and Cleanup
🔄 Not Started
- API documentation pending
- Deployment documentation needed
- Code cleanup and final review required

## Next Steps

Based on our progress, our next immediate priority should be completing the backend integration with our newly deployed contract. This involves:

1. Testing the backend API endpoints against the deployed contract:
   - Creating test listings with valid signatures
   - Submitting bids with proper ERC20 approvals
   - Verifying signature verification matches on-chain behavior

2. Implementing proper error handling for contract interactions:
   - Handling failed transactions
   - Managing signature verification errors
   - Providing meaningful error messages to users

3. Adding monitoring for contract events:
   - Setting up event listeners for successful trades
   - Updating in-memory storage based on on-chain events
   - Implementing proper error recovery for missed events

4. Creating a simple test suite for the API:
   - Testing listing creation and retrieval
   - Verifying bid submission and validation
   - Ensuring proper signature handling
