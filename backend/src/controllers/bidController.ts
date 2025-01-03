import { RequestHandler } from 'express'
import { Bid, ListingParams } from '../types'
import { storage } from '../storage'
import { contractService } from '../services/contractService'

export const getBids: RequestHandler<ListingParams> = (req, res) => {
  const { nftContract, tokenId } = req.params
  const bids = storage.getBids(nftContract, tokenId)
  res.json({ bids })
}

export const createBid: RequestHandler<ListingParams, any, Bid> = async (req, res) => {
  try {
    const { nftContract, tokenId } = req.params
    const bid: Bid = req.body

    if (bid.nftContract.toLowerCase() !== nftContract.toLowerCase() || bid.tokenId !== tokenId) {
      res.status(400).json({ error: 'Bid parameters mismatch' })
      
      return
    }

    const isValid = await contractService.verifyBidSignature(bid)
    if (!isValid) {
      res.status(400).json({ error: 'Invalid signature' })

      return
    }

    const storedBid = {
      ...bid,
      timestamp: Date.now()
    };
    storage.addBid(storedBid);

    res.status(201).json({ bid: storedBid });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
}
