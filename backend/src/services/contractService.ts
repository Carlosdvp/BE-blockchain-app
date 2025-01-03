import { ethers } from 'ethers'
import { NFTMarketplaceABI } from '../abi/NFTMarketplace'
import { Bid, Listing } from '../types'

export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.Provider

  constructor() {
    this.provider = ethers.getDefaultProvider(process.env.NETWORK || 'sepolia', {})

    this.contract = new ethers.Contract(
      process.env.MARKETPLACE_CONTRACT_ADDRESS!,
      NFTMarketplaceABI,
      this.provider
    )
  }

  async verifyListingSignature(listing: Listing): Promise<boolean> {
    try {
      // Call the contract's signature verification function
      const hash = await this.contract._hashListing([
        listing.nftContract,
        listing.tokenId,
        listing.owner,
        listing.minPrice
      ])
      
      const recoveredAddress = ethers.verifyMessage(
        ethers.getBytes(hash),
        listing.signature
      )

      return recoveredAddress.toLowerCase() === listing.owner.toLowerCase()

    } catch (error) {
      console.error('Error verifying listing signature:',error)

      return false
    }
  }

  async verifyBidSignature(bid: Bid): Promise<boolean> {
    try {
      const hash = await this.contract._hashBid([
        bid.nftContract,
        bid.tokenId,
        bid.bidder,
        bid.amount,
        bid.paymentToken
      ])

      const recoveredAddress = ethers.verifyMessage(
        ethers.getBytes(hash),
        bid.signature
      )

      return recoveredAddress.toLowerCase() === bid.bidder.toLowerCase()

    } catch (error) {
      console.error('Signature verification failed:', error)

      return false
    }
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber()
  }
}

export const contractService = new ContractService()
