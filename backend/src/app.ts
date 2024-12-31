import express from 'express'
import cors from 'cors'

import listingRoutes from './routes/listingRoutes'
import bidRoutes from './routes/bidRoutes'
import { storage } from './storage'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use('/api/listings', listingRoutes)
  app.use('/api/listings', bidRoutes)

  return app
}

// Start cleanup process (every hour)
export function setupCleanupProcess() {
  const ONE_HOUR = 3600000

  return setInterval(() => {
    storage.cleanupOldData(ONE_HOUR)
  }, ONE_HOUR)
}
