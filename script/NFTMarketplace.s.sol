// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract NFTMarketplaceScript is Script {
  struct DeploymentConfig {
    uint256 chainId;
    string networkName;
    address deployer;
  }

  function setUp() view public {
    // Prevent accidental mainnet deployment
    require(block.chainid != 1, "Mainnet deployment not allowed");
  }

  function run() public {
    // Get deployment configuration
    DeploymentConfig memory config = _getDeploymentConfig();
    
    // Log pre-deployment information
    console.log("\n=== Deployment Configuration ===");
    console.log("Network:", config.networkName);
    console.log("Chain ID:", config.chainId);
    console.log("Deployer:", config.deployer);
    console.log("=============================\n");

    // Deploy the contract
    console.log("Deploying NFTMarketplace...");

    vm.startBroadcast();
    NFTMarketplace marketplace = new NFTMarketplace();
    vm.stopBroadcast();

    // Log the successful deployment information
    console.log("\n=== Deployment Successful ===");
    console.log("NFTMarketplace:", address(marketplace));
    console.log("Network:", config.networkName);
    console.log("Block:", block.number);
    console.log("Timestamp:", block.timestamp);
    console.log("===========================\n");

    // Provide manual instructions
    console.log("Next steps:");
    console.log("1. Create the deployment file in backend/deployments/");
    console.log("2. Update backend environment configuration");
    console.log("3. Verify contract on Etherscan");
  }

  function _getDeploymentConfig() internal view returns (DeploymentConfig memory) {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address deployer = vm.addr(deployerPrivateKey);
    
    // Determine network name from chain ID
    string memory networkName;
    if (block.chainid == 11155111) {
      networkName = "sepolia";
    } else {
      networkName = "unknown";
    }

    return DeploymentConfig({
      chainId: block.chainid,
      networkName: networkName,
      deployer: deployer
    });
  }
}
