import { Router } from 'express'
import * as baseController from '../controllers/baseController'

const router = Router()

// Root endpoint with API information
router.get('/', baseController.getHome)

// Health check endpoint
router.get('/health', baseController.getHealth)

export default router
