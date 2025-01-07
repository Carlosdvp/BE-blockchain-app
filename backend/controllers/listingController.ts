import { RequestHandler } from 'express'
import { Listing } from '../types'
import { storage } from '../storage'
import { getContractService  } from '../services/contractService'

export const getAllListings: RequestHandler = (req, res) => {
  try {
    const listings = storage.getAllListings()
    res.json({ listings })
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({ 
      error: 'Failed to fetch listings',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const createListing: RequestHandler<{}, any, Listing> = async (req, res): Promise<void> => {
  try {
    const { nftContract, tokenId } = req.body
    storage.addListing(nftContract, tokenId, req.body)
    res.status(201).json({ message: 'Listing created' })
  } catch (error) {
      res.status(500).json({ error: 'Failed to create listing' })
  }
}
