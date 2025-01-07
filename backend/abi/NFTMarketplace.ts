export const NFTMarketplaceABI = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{ inputs: [], name: 'ECDSAInvalidSignature', type: 'error' },
	{
		inputs: [{ internalType: 'uint256', name: 'length', type: 'uint256' }],
		name: 'ECDSAInvalidSignatureLength',
		type: 'error'
	},
	{
		inputs: [{ internalType: 'bytes32', name: 's', type: 'bytes32' }],
		name: 'ECDSAInvalidSignatureS',
		type: 'error'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'nftContract', type: 'address' },
			{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ indexed: false, internalType: 'address', name: 'seller', type: 'address' },
			{ indexed: false, internalType: 'address', name: 'buyer', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' }
		],
		name: 'AuctionSettled',
		type: 'event'
	},
	{
		inputs: [],
		name: 'BID_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'DOMAIN_SEPARATOR',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'LISTING_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'nftContract', type: 'address' },
					{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
					{ internalType: 'address', name: 'bidder', type: 'address' },
					{ internalType: 'uint256', name: 'amount', type: 'uint256' },
					{ internalType: 'address', name: 'paymentToken', type: 'address' },
					{ internalType: 'bytes', name: 'signature', type: 'bytes' }
				],
				internalType: 'struct NFTMarketplace.Bid',
				name: 'bid',
				type: 'tuple'
			}
		],
		name: '_hashBid',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'nftContract', type: 'address' },
					{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
					{ internalType: 'address', name: 'owner', type: 'address' },
					{ internalType: 'uint256', name: 'minPrice', type: 'uint256' },
					{ internalType: 'bytes', name: 'signature', type: 'bytes' }
				],
				internalType: 'struct NFTMarketplace.Listing',
				name: 'listing',
				type: 'tuple'
			}
		],
		name: '_hashListing',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'nftContract', type: 'address' },
					{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
					{ internalType: 'address', name: 'owner', type: 'address' },
					{ internalType: 'uint256', name: 'minPrice', type: 'uint256' },
					{ internalType: 'bytes', name: 'signature', type: 'bytes' }
				],
				internalType: 'struct NFTMarketplace.Listing',
				name: 'listing',
				type: 'tuple'
			},
			{
				components: [
					{ internalType: 'address', name: 'nftContract', type: 'address' },
					{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
					{ internalType: 'address', name: 'bidder', type: 'address' },
					{ internalType: 'uint256', name: 'amount', type: 'uint256' },
					{ internalType: 'address', name: 'paymentToken', type: 'address' },
					{ internalType: 'bytes', name: 'signature', type: 'bytes' }
				],
				internalType: 'struct NFTMarketplace.Bid',
				name: 'bid',
				type: 'tuple'
			},
			{ internalType: 'bytes', name: 'ownerApproval', type: 'bytes' }
		],
		name: 'settleAuction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]
