import express, { Request, Response, RequestHandler } from 'express'
import cors from 'cors'

import { storage } from './storage'
import { Listing, Bid, ListingParams } from './types'
import { verifySignature } from './utils'

const app = express()
app.use(express.json())
app.use(cors())

const ONE_HOUR = 3600000

const createListing: RequestHandler<{}, any, Listing> = async (req, res) => {
  try {
    const listing: Listing = req.body

    const isValid = await verifySignature(listing)
    if (!isValid) {
      res.status(400).json({ error: 'Invalid signature' })

      return
    }

    const storedListing = {
      ...listing,
      timestamp: Date.now()
    }
    storage.addListing(storedListing);

    res.status(201).json({ listing: storedListing })
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
};

// For the bids POST endpoint
const createBid: RequestHandler<ListingParams, any, Bid> = async (req, res) => {
  try {
    const { nftContract, tokenId } = req.params
    const bid: Bid = req.body

    // Verify bid matches URL parameters
    if (bid.nftContract.toLowerCase() !== nftContract.toLowerCase() || bid.tokenId !== tokenId) {
      res.status(400).json({ error: 'Bid parameters mismatch' })

      return
    }

    const isValid = await verifySignature(bid);
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
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/listings - Get all active listings
app.get('/api/listings', (_req: Request, res: Response) => {
  const listings = storage.getAllListings()
  res.json({ listings })
})

// POST /api/listings - Create a new listing
app.post('/api/listings', createListing)

// GET /api/listings/:nftContract/:tokenId/bids - Get all bids for a listing
app.get('/api/listings/:nftContract/:tokenId/bids', (req: Request<ListingParams>, res: Response) => {
  const { nftContract, tokenId } = req.params
  const bids = storage.getBids(nftContract, tokenId)
  res.json({ bids })
})

// POST /api/listings/:nftContract/:tokenId/bids - Submit a bid
app.post('/api/listings/:nftContract/:tokenId/bids', createBid)

// Start cleanup process (every hour)
setInterval(() => {
  storage.cleanupOldData(ONE_HOUR)
}, ONE_HOUR);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
