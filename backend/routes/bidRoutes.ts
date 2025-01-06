import { Router } from 'express'
import * as bidController from '../controllers/bidController'

const router = Router()

router.get('/:nftContract/:tokenId/bids', bidController.getBids)
router.post('/:nftContract/:tokenId/bids', bidController.createBid)

export default router
