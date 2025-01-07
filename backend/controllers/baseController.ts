import { RequestHandler } from 'express'
import { getContractService } from '../services/contractService'

export const getHome: RequestHandler = (req, res) => {
	// Handle content negotiation for home page
	res.format({
		'text/html': () => {
			res.send(`
        <html>
          <head>
            <title>NFT Marketplace API</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                line-height: 1.6;
              }
              code {
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <h1>NFT Marketplace API</h1>
            <p>Welcome to the NFT Marketplace API. The server is running successfully.</p>
            
            <h2>Available Endpoints:</h2>
            <ul>
              <li><code>GET /api/listings</code> - Get all active listings</li>
              <li><code>POST /api/listings</code> - Create a new listing</li>
              <li><code>GET /api/listings/:nftContract/:tokenId/bids</code> - Get bids for a listing</li>
              <li><code>POST /api/listings/:nftContract/:tokenId/bids</code> - Place a bid on a listing</li>
              <li><code>GET /health</code> - Check service health status</li>
            </ul>
          </body>
        </html>
      `)
		},
		'application/json': () => {
			res.json({
				name: 'NFT Marketplace API',
				status: 'operational',
				endpoints: {
					listings: {
						get: '/api/listings',
						post: '/api/listings'
					},
					bids: {
						get: '/api/listings/:nftContract/:tokenId/bids',
						post: '/api/listings/:nftContract/:tokenId/bids'
					},
					system: {
						health: '/health'
					}
				}
			})
		},
		default: () => {
			res.json({ status: 'ok' })
		}
	})
}

export const getHealth: RequestHandler = async (req, res) => {
	try {
		// Get contract connection status
		const contractService = getContractService()
		const blockNumber = await contractService.getBlockNumber()

		const healthStatus = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memory: process.memoryUsage(),
			contract: {
				address: process.env.MARKETPLACE_CONTRACT_ADDRESS,
				network: process.env.NETWORK || 'sepolia',
				chainId: process.env.CHAIN_ID || '11155111',
				currentBlock: blockNumber
			}
		}

		res.json(healthStatus)
	} catch (error) {
		console.error('Health check failed:', error)

		res.status(503).json({
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
			error: error instanceof Error ? error.message : 'Unknown error'
		})
	}
}
