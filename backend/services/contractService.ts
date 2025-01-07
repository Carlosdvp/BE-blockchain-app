import { ethers } from 'ethers'
import { NFTMarketplaceABI } from '../abi/NFTMarketplace'
import { Bid, Listing } from '../types'

export class ContractService {
  private static instance: ContractService
  private contract: ethers.Contract
  private provider: ethers.Provider

  private constructor() {
    this.provider = ethers.getDefaultProvider(process.env.NETWORK || 'sepolia', {})

    this.contract = new ethers.Contract(
      process.env.MARKETPLACE_CONTRACT_ADDRESS!,
      NFTMarketplaceABI,
      this.provider
    )
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService()
    }
    return ContractService.instance
  }

  private initialize() {
    if (!this.contract || !this.provider) {
      const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error('Invalid or missing MARKETPLACE_CONTRACT_ADDRESS');
      }

      this.provider = ethers.getDefaultProvider(process.env.NETWORK || 'sepolia', {});
      this.contract = new ethers.Contract(
        contractAddress,
        NFTMarketplaceABI,
        this.provider
      );
    }
  }

  async verifyListingSignature(listing: Listing): Promise<boolean> {
    this.initialize()
    try {
      // Call the contract's signature verification function
      const hash = await this.contract._hashListing([
        listing.nftContract,
        listing.tokenId,
        listing.owner,
        listing.minPrice
      ])
      
      const recoveredAddress = ethers.recoverAddress(hash, listing.signature)

      return recoveredAddress.toLowerCase() === listing.owner.toLowerCase()

    } catch (error) {
      console.error('Error verifying listing signature:',error)

      return false
    }
  }

  async verifyBidSignature(bid: Bid): Promise<boolean> {
    this.initialize()
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
    this.initialize()

    return this.provider.getBlockNumber()
  }
}

export const getContractService = () => ContractService.getInstance()
