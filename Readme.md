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

### Tests

1. Mock Contracts: We create simple versions of ERC721 and ERC20 tokens for testing. These allow us to mint tokens and manipulate states easily.
2. Test Setup: The setUp function creates our fresh testing environment before each test:
    - Deploys all contracts
    - Mints an NFT to the seller
    - Mints tokens to the buyer
    - Sets up necessary approvals

3. Signature Helpers: Two internal functions that help create properly formatted signatures for listings and bids using Foundry's vm.sign cheatcode.
4. Main Test Cases:
    - Successful auction settlement (fully implemented)
    - Invalid signatures (to be implemented)
    - Price verification (to be implemented)
    - Authorization checks (to be implemented)
