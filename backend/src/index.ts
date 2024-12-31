import { createApp, setupCleanupProcess } from './app'
import dotenv from 'dotenv'

dotenv.config()

const app = createApp()
const cleanup = setupCleanupProcess()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const server = app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
  console.log('Environment:', process.env.NODE_ENV || 'development')
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')

  clearInterval(cleanup)
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
