import { RequestHandler } from 'express'
import { Bid, ListingParams } from '../types'
import { storage } from '../storage'

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
    const { nftContract, tokenId } = req.params

    // Validate that we have a listing for this NFT
    const listing = storage.getListing(nftContract, tokenId)
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' })
      
      return
    }

    // Add the bid with timestamp
    const bidWithTimestamp = {
      ...req.body,
      timestamp: Date.now()
    }

    storage.addBid(nftContract, tokenId, req.body)
    res.status(201).json({ 
      message: 'Bid created successfully',
      bid: bidWithTimestamp 
    })
  } catch (error) {
      res.status(500).json({ error: 'Failed to create bid' })
  }
}
