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
    console.log('Received listing creation request:', {
      ...req.body,
      signature: req.body.signature.substring(0, 10) + '...' // Truncate for logging
    })

    const contractService = getContractService()
    const listing: Listing = req.body

    console.log('Verifying listing signature...')
    const isValid = await contractService.verifyListingSignature(listing)
    
    if (!isValid) {
      console.log('Signature verification failed for listing')
      res.status(400).json({ error: 'Invalid listing signature' })
      
      return
    }

    console.log('Storing listing...')
    const storedListing = {
      ...listing,
      timestamp: Date.now()
    }
    storage.addListing(storedListing)

    res.status(201).json({ 
      listing: storedListing,
      message: 'Listing created successfully'
    })
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({ 
      error: 'Failed to create listing',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
