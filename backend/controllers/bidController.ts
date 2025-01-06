import { RequestHandler } from 'express'
import { Bid, ListingParams } from '../types'
import { storage } from '../storage'
import { getContractService  } from '../services/contractService'
import { ethers } from 'ethers'

export const getBids: RequestHandler<ListingParams> = (req, res) => {
  try {
    const { nftContract, tokenId } = req.params
    const bids = storage.getBids(nftContract, tokenId)
    res.json({ bids })
  } catch (error) {
    console.error('Error fetching bids:', error)

    res.status(500).json({ 
      error: 'Failed to fetch bids',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const createBid: RequestHandler<ListingParams, any, Bid> = async (req, res): Promise<void> => {
  try {
    const contractService = getContractService()
    const { nftContract, tokenId } = req.params
    const bid: Bid = req.body

    console.log('Received bid creation request:', {
      ...req.body,
      signature: req.body.signature.substring(0, 10) + '...' // Truncate for logging
    })

    if (bid.nftContract.toLowerCase() !== nftContract.toLowerCase() || bid.tokenId !== tokenId) {
      res.status(400).json({ error: 'Bid parameters mismatch with URL' })

      return
    }

    const listing = storage.getListing(nftContract, tokenId)
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' })
      return
    }

    console.log('Verifying bid signature...')
    const isValid = await contractService.verifyBidSignature(bid)
    if (!isValid) {
      console.log('Signature verification failed for bid')

      res.status(400).json({ error: 'Invalid bid signature' })
      return
    }

    const storedBid = {
      ...bid,
      timestamp: Date.now()
    }
    storage.addBid(storedBid)

    res.status(201).json({ 
      bid: storedBid,
      message: 'Bid created successfully'
    })
  } catch (error) {
    console.error('Error creating bid:', error)
    res.status(500).json({ 
      error: 'Failed to create bid',
      details: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
