// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/NFTMarketplace.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// First, we'll need mock contracts for testing
contract MockERC721 is ERC721 {
  constructor() ERC721("MockNFT", "MNFT") {}

  function mint(address to, uint256 tokenId) external {
    _mint(to, tokenId);
  }
}

contract MockERC20 is ERC20 {
  constructor() ERC20("MockToken", "MTKN") {}

  function mint(address to, uint256 amount) external {
    _mint(to, amount);
  }
}

contract NFTMarketplaceTest is Test {
  NFTMarketplace marketplace;
  MockERC721 nft;
  MockERC20 token;

  // Test addresses with their private keys
  uint256 constant sellerPrivateKey = 0x1;
  uint256 constant buyerPrivateKey = 0x2;
  address seller;
  address buyer;
  
  // Test parameters
  uint256 constant tokenId = 1;
  uint256 constant price = 100 ether;

  function setUp() public {
    // Derive addresses from private keys
    seller = vm.addr(sellerPrivateKey);
    buyer = vm.addr(buyerPrivateKey);

    // Deploy our contracts
    marketplace = new NFTMarketplace();
    nft = new MockERC721();
    token = new MockERC20();

    // Setup seller with NFT
    nft.mint(seller, tokenId);
    vm.prank(seller);
    nft.approve(address(marketplace), tokenId);

    // Setup buyer with tokens
    token.mint(buyer, price);
    vm.prank(buyer);
    token.approve(address(marketplace), price);
  }

  // Test successful auction settlement
  function test_SettleAuction() public {
    // Create listing signature
    bytes memory listingSig = _signListing(
      address(nft),
      tokenId,
      seller,
      price,
      sellerPrivateKey
    );

    // Create bid signature
    bytes memory bidSig = _signBid(
      address(nft),
      tokenId,
      buyer,
      price,
      address(token),
      buyerPrivateKey
    );

    // Create listing
    NFTMarketplace.Listing memory listing = NFTMarketplace.Listing({
      nftContract: address(nft),
      tokenId: tokenId,
      owner: seller,
      minPrice: price,
      signature: listingSig
    });

    // Create bid
    NFTMarketplace.Bid memory bid = NFTMarketplace.Bid({
      nftContract: address(nft),
      tokenId: tokenId,
      bidder: buyer,
      amount: price,
      paymentToken: address(token),
      signature: bidSig
    });

    // Create owner approval
    bytes32 approvalHash = keccak256(abi.encodePacked(
      marketplace._hashListing(listing),
      marketplace._hashBid(bid)
    ));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(uint256(1), approvalHash);
    bytes memory ownerApproval = abi.encodePacked(r, s, v);

    // Record initial states
    assertEq(nft.ownerOf(tokenId), seller);
    assertEq(token.balanceOf(buyer), price);
    assertEq(token.balanceOf(seller), 0);

    // Execute the auction
    marketplace.settleAuction(listing, bid, ownerApproval);

    // Verify final states
    assertEq(nft.ownerOf(tokenId), buyer);
    assertEq(token.balanceOf(seller), price);
    assertEq(token.balanceOf(buyer), 0);
  }

  // Test invalid listing signature
  function test_RevertInvalidListingSignature() public {
    // Create listing with wrong signer (using buyer's key instead of seller's)
    bytes memory listingSig = _signListing(
      address(nft),
      tokenId,
      seller,
      price,
      buyerPrivateKey
    );

    NFTMarketplace.Listing memory listing = NFTMarketplace.Listing({
      nftContract: address(nft),
      tokenId: tokenId,
      owner: seller,
      minPrice: price,
      signature: listingSig
    });

    NFTMarketplace.Bid memory bid = NFTMarketplace.Bid({
      nftContract: address(nft),
      tokenId: tokenId,
      bidder: buyer,
      amount: price,
      paymentToken: address(token),
      signature: _signBid(address(nft), tokenId, buyer, price, address(token), buyerPrivateKey)
    });

    bytes32 approvalHash = keccak256(abi.encodePacked(
      marketplace._hashListing(listing),
      marketplace._hashBid(bid)
    ));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(sellerPrivateKey, approvalHash);
    bytes memory ownerApproval = abi.encodePacked(r, s, v);

    vm.expectRevert("Invalid listing signature");
    marketplace.settleAuction(listing, bid, ownerApproval);
  }

  // Test invalid bid signature
  function test_RevertInvalidBidSignature() public {
    // Create valid bid but with wrong listing signature
    bytes memory listingSig = _signListing(
      address(nft),
      tokenId,
      seller,
      price,
      buyerPrivateKey  // Wrong signer!
    );

    NFTMarketplace.Listing memory listing = NFTMarketplace.Listing({
      nftContract: address(nft),
      tokenId: tokenId,
      owner: seller,
      minPrice: price,
      signature: listingSig
    });

    NFTMarketplace.Bid memory bid = NFTMarketplace.Bid({
      nftContract: address(nft),
      tokenId: tokenId,
      bidder: buyer,
      amount: price,
      paymentToken: address(token),
      signature: _signBid(address(nft), tokenId, buyer, price, address(token), buyerPrivateKey)
    });

    bytes32 approvalHash = keccak256(abi.encodePacked(
      marketplace._hashListing(listing),
      marketplace._hashBid(bid)
    ));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(sellerPrivateKey, approvalHash);
    bytes memory ownerApproval = abi.encodePacked(r, s, v);

    vm.expectRevert("Invalid listing signature");
    marketplace.settleAuction(listing, bid, ownerApproval);
  }

  function test_RevertBidTooLow() public {
    // Create bid with amount less than minPrice
    uint256 lowPrice = price / 2;  // Half of the minimum price
    
    bytes memory listingSig = _signListing(
      address(nft),
      tokenId,
      seller,
      price,  // Original price as minimum
      sellerPrivateKey
    );

    bytes memory bidSig = _signBid(
      address(nft),
      tokenId,
      buyer,
      lowPrice,  // Lower bid amount
      address(token),
      buyerPrivateKey
    );

    NFTMarketplace.Listing memory listing = NFTMarketplace.Listing({
      nftContract: address(nft),
      tokenId: tokenId,
      owner: seller,
      minPrice: price,
      signature: listingSig
    });

    NFTMarketplace.Bid memory bid = NFTMarketplace.Bid({
      nftContract: address(nft),
      tokenId: tokenId,
      bidder: buyer,
      amount: lowPrice,  // Lower than minPrice
      paymentToken: address(token),
      signature: bidSig
    });

    bytes32 approvalHash = keccak256(abi.encodePacked(
      marketplace._hashListing(listing),
      marketplace._hashBid(bid)
    ));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(sellerPrivateKey, approvalHash);
    bytes memory ownerApproval = abi.encodePacked(r, s, v);

    vm.expectRevert("Bid too low");
    marketplace.settleAuction(listing, bid, ownerApproval);
  }

  function test_RevertUnauthorizedNFT() public {
    // First create valid signatures
    bytes memory listingSig = _signListing(
      address(nft),
      tokenId,
      seller,
      price,
      sellerPrivateKey
    );

    bytes memory bidSig = _signBid(
      address(nft),
      tokenId,
      buyer,
      price,
      address(token),
      buyerPrivateKey
    );

    NFTMarketplace.Listing memory listing = NFTMarketplace.Listing({
      nftContract: address(nft),
      tokenId: tokenId,
      owner: seller,
      minPrice: price,
      signature: listingSig
    });

    NFTMarketplace.Bid memory bid = NFTMarketplace.Bid({
      nftContract: address(nft),
      tokenId: tokenId,
      bidder: buyer,
      amount: price,
      paymentToken: address(token),
      signature: bidSig
    });

    bytes32 approvalHash = keccak256(abi.encodePacked(
      marketplace._hashListing(listing),
      marketplace._hashBid(bid)
    ));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(sellerPrivateKey, approvalHash);
    bytes memory ownerApproval = abi.encodePacked(r, s, v);

    // Remove NFT approval
    vm.prank(seller);
    nft.approve(address(0), tokenId);

    // Expect the custom error ERC721InsufficientApproval from OpenZeppelin
    vm.expectRevert(
      abi.encodeWithSignature(
        "ERC721InsufficientApproval(address,uint256)",
        address(marketplace),
        tokenId
      )
    );
    marketplace.settleAuction(listing, bid, ownerApproval);
  }

  // Helper function to create a listing signature
  function _signListing(
    address _nft,
    uint256 _tokenId,
    address _owner,
    uint256 _minPrice,
    uint256 ownerKey
  ) internal view returns (bytes memory) {
    bytes32 digest = marketplace._hashListing(
      NFTMarketplace.Listing({
        nftContract: _nft,
        tokenId: _tokenId,
        owner: _owner,
        minPrice: _minPrice,
        signature: "" // Not needed for hash
      })
    );
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, digest);
    return abi.encodePacked(r, s, v);
  }

  function _signBid(
    address _nft,
    uint256 _tokenId,
    address _bidder,
    uint256 _amount,
    address _paymentToken,
    uint256 bidderKey
  ) internal view returns (bytes memory) {
    bytes32 digest = marketplace._hashBid(
      NFTMarketplace.Bid({
        nftContract: _nft,
        tokenId: _tokenId,
        bidder: _bidder,
        amount: _amount,
        paymentToken: _paymentToken,
        signature: "" // Not needed for hash
      })
    );
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(bidderKey, digest);
    return abi.encodePacked(r, s, v);
  }
}
