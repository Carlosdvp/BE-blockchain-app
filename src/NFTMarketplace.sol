// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title NFT Marketplace
/// @notice A simple marketplace for trading NFTs using off-chain signatures
contract NFTMarketplace {
  using ECDSA for bytes32;

  event AuctionSettled(
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address buyer,
    uint256 price
  );

  struct Listing {
    address nftContract;
    uint256 tokenId;
    address owner;
    uint256 minPrice;
    bytes signature;
  }

  struct Bid {
    address nftContract;
    uint256 tokenId;
    address bidder;
    uint256 amount;
    address paymentToken;
    bytes signature;
  }

  // Type hashes for EIP-712 signature verification
  bytes32 public constant LISTING_TYPEHASH = keccak256(
    "Listing(address nftContract,uint256 tokenId,address owner,uint256 minPrice)"
  );

  bytes32 public constant BID_TYPEHASH = keccak256(
    "Bid(address nftContract,uint256 tokenId,address bidder,uint256 amount)"
  );

  // Domain separator for EIP-712
  bytes32 public immutable DOMAIN_SEPARATOR;

  constructor() {
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak256("NFTMarketplace"),
        keccak256("1"),
        block.chainid,
        address(this)
      )
    );
  }

  // Core signature verification functions
  function _hashListing(Listing calldata listing) internal view returns (bytes32) {
    return keccak256(
      abi.encodePacked(
        "\x19\x01",
        DOMAIN_SEPARATOR,
        keccak256(
          abi.encode(
            LISTING_TYPEHASH,
            listing.nftContract,
            listing.tokenId,
            listing.owner,
            listing.minPrice
          )
        )
      )
    );
  }

  function _hashBid(Bid calldata bid) internal view returns (bytes32) {
    return keccak256(
      abi.encodePacked(
        "\x19\x01",
        DOMAIN_SEPARATOR,
        keccak256(
          abi.encode(
            BID_TYPEHASH,
            bid.nftContract,
            bid.tokenId,
            bid.bidder,
            bid.amount
          )
        )
      )
    );
  }

  function _verifySignature(bytes32 hash, bytes memory signature, address signer) internal pure returns (bool) {
    return hash.recover(signature) == signer;
  }

  // Core auction settlement function
  function settleAuction(
    Listing calldata listing,
    Bid calldata bid,
    bytes calldata ownerApproval
  ) external {
    // 1. Verify listing signature
    require(_verifySignature(_hashListing(listing), listing.signature, listing.owner), "Invalid listing signature");
    
    // 2. Verify bid signature
    require(_verifySignature(_hashBid(bid), bid.signature, bid.bidder), "Invalid bid signature");
    
    // 3. Verify owner approval of this specific bid
    bytes32 approvalHash = keccak256(abi.encodePacked(_hashListing(listing), _hashBid(bid)));
    require(_verifySignature(approvalHash, ownerApproval, listing.owner), "Invalid owner approval");

    // 4. Verify bid meets minimum price
    require(bid.amount >= listing.minPrice, "Bid too low");

    // 5. Verify NFT contract and token match
    require(
      listing.nftContract == bid.nftContract && 
      listing.tokenId == bid.tokenId,
      "NFT mismatch"
    );

    // 6. Transfer tokens from bidder to owner
    IERC20 paymentToken = IERC20(bid.paymentToken);
    require(
      paymentToken.transferFrom(bid.bidder, listing.owner, bid.amount),
      "Payment failed"
    );

    // 7. Transfer NFT from owner to bidder
    IERC721(listing.nftContract).safeTransferFrom(
      listing.owner,
      bid.bidder,
      listing.tokenId
    );

    // 8. Emit event
    emit AuctionSettled(
      listing.nftContract,
      listing.tokenId,
      listing.owner,
      bid.bidder,
      bid.amount
    );
  }
}
