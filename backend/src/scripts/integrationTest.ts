import axios from 'axios'
import { ethers } from 'ethers'

async function testIntegration() {
  // Create a test listing with valid signature
  const wallet = ethers.Wallet.createRandom()
  const listing = {
    nftContract: '0x0A20b2ca38771D1CcB5f9D3b924DDf401F7c07e1',
    tokenId: '1',
    owner: wallet.address,
    minPrice: ethers.parseEther('0.1').toString()
  };

  // Add signature
  const signature = await wallet.signMessage(ethers.toUtf8Bytes('test'))
  const listingWithSig = { ...listing, signature }

  try {
    // Test health check
    const health = await axios.get('http://localhost:3000/health')
    console.log('Health check:', health.data)

    // Create listing
    const createResponse = await axios.post('http://localhost:3000/api/listings', listingWithSig)
    console.log('Created listing:', createResponse.data)

    // Get listings
    const getResponse = await axios.get('http://localhost:3000/api/listings')
    console.log('All listings:', getResponse.data)
  } catch (error) {
    console.error('Integration test failed:', error)
  }
}

testIntegration()
