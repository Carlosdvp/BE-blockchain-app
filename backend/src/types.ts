export interface Listing {
  nftContract: string;
  tokenId: string;
  owner: string;
  minPrice: string;
  signature: string;
}

export interface Bid {
  nftContract: string;
  tokenId: string;
  bidder: string;
  amount: string;
  paymentToken: string;
  signature: string;
}

// In-memory storage types
export interface StoredListing extends Listing {
  timestamp: number;
}

export interface StoredBid extends Bid {
  timestamp: number;
}

// Type definition for route parameters
export interface ListingParams {
  nftContract: string;
  tokenId: string;
}
