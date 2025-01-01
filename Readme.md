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

# Remaining Tasks

1. Smart Contract Finalization

Run full integration tests on testnet

2. Backend Completion

Add request validation middleware
Implement proper error handling system
Add request logging
Complete API documentation
Add health check endpoints

3. Testing and Integration

Create integration tests between contract and backend
Set up automated testing pipeline
Add load testing scenarios
Implement contract event listeners

4. Documentation

Create API documentation
Write deployment instructions
Add usage examples
Document security considerations

5. Development Tools

Add development scripts
Create local testing environment
Add monitoring and logging
Implement development convenience tools


# Next Immediate Steps

## Deploy smart contract to Sepolia:

Prepare deployment script
Set up environment variables
Verify contract post-deployment


Enhance backend security:

Add input validation
Implement rate limiting
Add security headers


Create integration test suite:

Test contract-backend interaction
Verify signature handling
Test error scenarios


Add API documentation:

Set up Swagger
Document all endpoints
Add usage examples



# Success Criteria Checklist

To consider the project complete, we need to verify:

- Single-transaction trading functionality
- Gas efficiency in contract operations
- Proper signature verification
- Secure backend implementation
- Comprehensive test coverage
- Clear documentation
- Easy deployment process
