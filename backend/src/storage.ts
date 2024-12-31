import { StoredListing, StoredBid } from './types'

class Storage {
  private listings: Map<string, StoredListing>
  private bids: Map<string, StoredBid>

  constructor() {
    this.listings = new Map()
    this.bids = new Map()
  }

  // Generate a unique key for a listing

  // Listing operations

  // Bid operations

  // Clean up old data
  cleanupOldData(maxAgeMs: number): void {}
}

// Export a singleton instance
export const storage = new Storage()
