import axios from 'axios'
import { ethers } from 'ethers'

async function testIntegration() {
  const baseUrl = 'http://localhost:3000/'

  // Create a test listing with valid signature
  const seller = ethers.Wallet.createRandom()
  const buyer = ethers.Wallet.createRandom()

  // Test data
  const testListing = {
    nftContract: '0x1234567890123456789012345678901234567890',
    tokenId: '1',
    owner: seller.address,
    minPrice: ethers.parseEther('0.1').toString(),
    signature: ''
  }

  const testBid = {
    nftContract: testListing.nftContract,
    tokenId: testListing.tokenId,
    bidder: buyer.address,
    amount: testListing.minPrice,
    paymentToken: '0x2234567890123456789012345678901234567890',
    signature: ''
  }

  try {
    // Test health check
    console.log('\nTesting health endpoint...')
    const health = await axios.get(`${baseUrl}/health`)
    console.log('Health check status:', health.data)

    // Create and test listing
    console.log('\nTesting listing creation...')
    const createListing = await axios.post(`${baseUrl}/api/listings`, testListing)
    console.log('Created listing:', createListing.data)

    // Get listings
    console.log('\nGetting all listings...')
    const getResponse = await axios.get(`${baseUrl}/api/listings`)
    console.log('All listings:', getResponse.data)

    // Create and test bid
    console.log('\nTesting bid creation...')
    const createBid = await axios.post(`${baseUrl}/listings/${testListing.nftContract}/${testListing.tokenId}/bids`, testBid)
    console.log('Created bid:', createBid.data)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testIntegration()
