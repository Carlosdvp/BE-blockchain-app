import { ethers } from 'ethers'
import { Listing, Bid } from './types'

// Listing type hash from our smart contract
const LISTING_TYPEHASH = null

// Bid type hash from our smart contract
const BID_TYPEHASH = null

// Domain separator params - should match smart contract
const DOMAIN_SEPARATOR = []

export async function verifySignature(data: Listing | Bid): Promise<boolean> {
  // Create the appropriate hash based on data type

  // Create the hash that was signed

  // Recover the signer

  // Verify the signer is correct
  
  return true
}