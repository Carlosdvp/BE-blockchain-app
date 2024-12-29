// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
  NFTMarketplace marketplace;

  function setUp() public {
    marketplace = new NFTMarketplace();
  }

  function test_DeploymentSuccess() public {
    assertTrue(address(marketplace) != address(0), "Marketplace deployment failed");
  }
}
