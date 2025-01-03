import { RequestHandler } from 'express'
import { Listing } from '../types'
import { storage } from '../storage'
import { contractService } from '../services/contractService'

export const getAllListings: RequestHandler = (req, res) => {
  const listings = storage.getAllListings()
  res.json({ listings })
}

export const createListing: RequestHandler<{}, any, Listing> = async (req, res) => {
  try {
    const listing: Listing = req.body
    const isValid =  await contractService.verifyListingSignature(listing)

    if (!isValid) {
      res.status(400).json({ error: 'Invalid signature' })

      return
    }

    const storedListing = {
      ...listing,
      timestamp: Date.now()
    }
    storage.addListing(storedListing)

    res.status(201).json({ listing: storedListing })
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
