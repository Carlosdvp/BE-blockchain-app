import { Router } from 'express'
import * as listingController from '../controllers/listingController'

const router = Router()

router.get('/', listingController.getAllListings)
router.post('/', listingController.createListing)

export default router
