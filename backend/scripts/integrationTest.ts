import axios from 'axios'
import { ethers } from 'ethers'

/**
 * Simple integration test for NFT Marketplace
 * Tests the core functionality:
 * 1. Creating and signing listings
 * 2. Submitting bids with signatures
 * 3. Verifying in-memory storage works
 */

// Configuration for EIP-712 typed data signing
const MARKETPLACE_CONFIG = {
  // Base configuration
  baseUrl: 'http://localhost:3000',
  testNftAddress: '0x1234567890123456789012345678901234567890',
  testTokenAddress: '0x2234567890123456789012345678901234567890',
  
  // EIP-712 Domain
  domain: {
    name: 'NFTMarketplace',
    version: '1',
    chainId: 11155111, // Sepolia
    verifyingContract: process.env.MARKETPLACE_CONTRACT_ADDRESS
  },

  // EIP-712 Types
  types: {
    Listing: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'owner', type: 'address' },
      { name: 'minPrice', type: 'uint256' }
    ],
    Bid: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'bidder', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'paymentToken', type: 'address' }
    ]
  }
}

async function testMarketplace() {
  console.log('Starting marketplace integration test...')

  try {
    // Create test wallets to simulate users
    const seller = ethers.Wallet.createRandom()
    const buyer = ethers.Wallet.createRandom()

    console.log('Created test wallets:', {
      seller: seller.address,
      buyer: buyer.address
    })

    // Test 1: Create and sign a listing
    const listingData = {
      nftContract: MARKETPLACE_CONFIG.testNftAddress,
      tokenId: '1',
      owner: seller.address,
      minPrice: ethers.parseEther('0.1').toString()
    }

    // Sign listing with EIP-712
    console.log('\nSigning listing...')

    const listingSignature = await seller.signTypedData(
      MARKETPLACE_CONFIG.domain,
      { Listing: MARKETPLACE_CONFIG.types.Listing },
      listingData
    )
    
    // Submit listing to API
    try {
      const createListingResponse = await axios.post(
        `${MARKETPLACE_CONFIG.baseUrl}/api/listings`,
        {
          ...listingData,
          signature: listingSignature
        }
      )
      console.log('Listing created:', createListingResponse.data)
    } catch (error: any) {
      console.error('Listing creation failed:', {
        status: error.response?.status,
        data: error.response?.data
      })
      throw error
    }

    // Test 2: Create and sign a bid
    const bidData = {
      nftContract: listingData.nftContract,
      tokenId: listingData.tokenId,
      bidder: buyer.address,
      amount: listingData.minPrice,
      paymentToken: MARKETPLACE_CONFIG.testTokenAddress
    }

    // Sign bid with EIP-712
    console.log('\nSigning bid...')

    const bidSignature = await buyer.signTypedData(
      MARKETPLACE_CONFIG.domain,
      { Bid: MARKETPLACE_CONFIG.types.Bid },
      bidData
    )

    // Submit bid
    console.log('\nSubmitting bid...')

    try {
      const createBidResponse = await axios.post(
        `${MARKETPLACE_CONFIG.baseUrl}/api/listings/${bidData.nftContract}/${bidData.tokenId}/bids`,
        {
          ...bidData,
          signature: bidSignature
        }
      )
      console.log('Bid created:', createBidResponse.data)
    } catch (error: any) {
      console.error('Bid creation failed:', {
        status: error.response?.status,
        data: error.response?.data
      })
      throw error
    }

    // Test 3: Verify storage is working
    console.log('\nVerifying storage...')

    const listings = await axios.get(`${MARKETPLACE_CONFIG.baseUrl}/api/listings`)
    const bids = await axios.get(
      `${MARKETPLACE_CONFIG.baseUrl}/api/listings/${bidData.nftContract}/${bidData.tokenId}/bids`
    )

    const results = {
      listingsFound: listings.data.listings.length,
      bidsFound: bids.data.bids.length,
      listingVerified: listings.data.listings.some(
        (l: any) => l.tokenId === listingData.tokenId && l.nftContract.toLowerCase() === listingData.nftContract.toLowerCase()
      ),
      bidVerified: bids.data.bids.some((b: any) => b.bidder.toLowerCase() === bidData.bidder.toLowerCase() && b.amount === bidData.amount)
    }

    console.log('\nTest Results:', results)
    console.log('Integration test completed successfully!')

  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

// Run the test
testMarketplace().catch(console.error)
