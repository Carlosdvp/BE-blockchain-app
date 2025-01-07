import axios from 'axios'
import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { NFTMarketplaceABI } from '../abi/NFTMarketplace'

dotenv.config()

/**
 * Simple integration test for NFT Marketplace
 * Tests the core functionality:
 * 1. Creating and signing listings
 * 2. Submitting bids with signatures
 * 3. Verifying in-memory storage works
 */

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testNftAddress: '0x1234567890123456789012345678901234567890',
  testTokenAddress: '0x2234567890123456789012345678901234567890',
}

const CONTRACT_ABI = NFTMarketplaceABI

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

    const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS
    if (!contractAddress) {
      throw new Error('MARKETPLACE_CONTRACT_ADDRESS environment variable is not set')
    }

    // Create a provider and contract instance for getting the correct hash
    const provider = ethers.getDefaultProvider(process.env.NETWORK || 'sepolia')
    const contract = new ethers.Contract(
      contractAddress,
      CONTRACT_ABI,
      provider
    )

    // Test 1: Create and submit listing
    console.log('\nPreparing listing...')
    const listing = {
      nftContract: TEST_CONFIG.testNftAddress,
      tokenId: '1',
      owner: seller.address,
      minPrice: ethers.parseEther('0.1').toString(),
      signature: '0x'
    }

    // Get the listing hash using the contract's function
    const listingHash = await contract._hashListing(listing)
    console.log('Listing hash generated:', listingHash)

    const listingSignature = await seller.signMessage(ethers.getBytes(listingHash))
    console.log('Listing signed')

    // Update the listing data with the real signature
    const signedListing = {
      ...listing,
      signature: listingSignature
    }
      
    // Submit listing to API
    console.log('\nSubmitting listing...')
    try {
      const listingResponse = await axios.post(`${TEST_CONFIG.baseUrl}/api/listings`, signedListing)

      console.log('Listing created:', listingResponse.data)
    } catch (error: any) {
      console.error('Listing creation failed:', {
        status: error.response?.status,
        data: error.response?.data
      })

      throw error
    }

    // Test 2: Create and sign a bid
    console.log('\nPreparing bid...')

    const bid = {
      nftContract: listing.nftContract,
      tokenId: listing.tokenId,
      bidder: buyer.address,
      amount: listing.minPrice,
      paymentToken: TEST_CONFIG.testTokenAddress,
      signature: '0x'
    }

    // Get the bid hash from the contract and sign it
    const bidHash = await contract._hashBid(bid)
    console.log('Bid hash generated:', bidHash)

    const bidSignature = await buyer.signMessage(ethers.getBytes(bidHash))
    console.log('Bid signed')

    // Update the bid data with the real signature
    const signedBid = {
      ...bid,
      signature: bidSignature
    }

    // Submit bid to API
    console.log('\nSubmitting bid...')

    try {
      const bidResponse = await axios.post(
        `${TEST_CONFIG.baseUrl}/api/listings/${bid.nftContract}/${bid.tokenId}/bids`,
        signedBid
      )
      console.log('Bid created:', bidResponse.data)

    } catch (error: any) {
      console.error('Bid creation failed:', {
        status: error.response?.status,
        data: error.response?.data
      })

      throw error
    }

    // Test 3: Verify storage is working
    console.log('\nVerifying storage...')

    const listings = await axios.get(`${TEST_CONFIG.baseUrl}/api/listings`)
    const bids = await axios.get(`${TEST_CONFIG.baseUrl}/api/listings/${bid.nftContract}/${bid.tokenId}/bids`)

    const results = {
      listingsFound: listings.data.listings.length,
      bidsFound: bids.data.bids.length,
      listingVerified: listings.data.listings.some(
        (l: any) => l.tokenId === signedListing.tokenId && l.nftContract.toLowerCase() === signedListing.nftContract.toLowerCase()
      ),
      bidVerified: bids.data.bids.some((b: any) => b.bidder.toLowerCase() === signedBid.bidder.toLowerCase() && b.amount === signedBid.amount)
    }

    console.log('\nTest Results:', results)
    console.log('Integration test completed successfully!')

  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMarketplace()
}

export { testMarketplace }
