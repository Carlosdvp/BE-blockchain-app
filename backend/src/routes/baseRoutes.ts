import { Router } from 'express'
import { contractService } from '../services/contractService'

const router = Router()

// Basic welcome route that shows API status
router.get('/', (req, res) => {
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
            </ul>
          </body>
        </html>
      `)
    },
    // For API clients expecting JSON
    'application/json': () => {
      res.json({
        status: 'ok',
        message: 'NFT Marketplace API is running',
        version: '1.0.0',
        endpoints: {
          listings: {
            get: '/api/listings',
            post: '/api/listings'
          },
          bids: {
            get: '/api/listings/:nftContract/:tokenId/bids',
            post: '/api/listings/:nftContract/:tokenId/bids'
          }
        }
      })
    }
  })
})

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check contract connection
    const blockNumber = await contractService.getBlockNumber();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      contract: {
        address: process.env.MARKETPLACE_CONTRACT_ADDRESS,
        network: process.env.NETWORK,
        chainId: process.env.CHAIN_ID,
        currentBlock: blockNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Contract connection failed',
      timestamp: new Date().toISOString()
    });
  }
})

export default router
