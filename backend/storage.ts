import { StoredListing, StoredBid } from './types'

class Storage {
	private listings: Map<string, StoredListing>
	private bids: Map<string, StoredBid[]>

	constructor() {
		this.listings = new Map()
		this.bids = new Map()
	}

	// Generate a unique key for a listing
	private getListingKey(nftContract: string, tokenId: string): string {
		return `${nftContract.toLowerCase()}-${tokenId}`
	}

	addListing(nftContract: string, tokenId: string, listing: any) {
		const key = `${nftContract}-${tokenId}`
		this.listings.set(key, listing)
	}

	getListing(nftContract: string, tokenId: string): StoredListing | undefined {
		const key = this.getListingKey(nftContract, tokenId)

		return this.listings.get(key)
	}

	getAllListings(): StoredListing[] {
		return Array.from(this.listings.values())
	}

	removeListing(nftContract: string, tokenId: string): boolean {
		const key = this.getListingKey(nftContract, tokenId)

		return this.listings.delete(key)
	}

	// Bid operations
	addBid(nftContract: string, tokenId: string, bid: any) {
		const key = `${nftContract}-${tokenId}`
		const bids = this.bids.get(key) || []

		bids.push(bid)
		this.bids.set(key, bids)
	}

	getBids(nftContract: string, tokenId: string): StoredBid[] {
		const key = this.getListingKey(nftContract, tokenId)

		return this.bids.get(key) || []
	}

	getAllBids(): StoredBid[] {
		return Array.from(this.bids.values()).flat()
	}

	// Clean up old data
	cleanupOldData(maxAgeMs: number): void {
		const now = Date.now()
		for (const [key, listing] of this.listings.entries()) {
			if (now - listing.timestamp > maxAgeMs) {
				this.listings.delete(key)
			}
		}

		for (const [key, bids] of this.bids.entries()) {
			const filteredBids = bids.filter(bid => now - bid.timestamp <= maxAgeMs)
			if (filteredBids.length === 0) {
				this.bids.delete(key)
			} else {
				this.bids.set(key, filteredBids)
			}
		}
	}
}

export const storage = new Storage()
