import express from 'express'
import cors from 'cors'
import { storage } from './storage'
import { Listing, Bid } from './types'
import { verifySignature } from './utils'

const app = express()
app.use(express.json())
app.use(cors())

const ONE_HOUR = 3600000

// GET /api/listings - Get all active listings

// POST /api/listings - Create a new listing

// GET /api/listings/:nftContract/:tokenId/bids - Get all bids for a listing

// POST /api/listings/:nftContract/:tokenId/bids - Submit a bid

// Start cleanup process (every hour)
setInterval(() => {
  storage.cleanupOldData(ONE_HOUR)
}, ONE_HOUR);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
