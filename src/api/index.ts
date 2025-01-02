import express from 'express'

import MessageResponse from '../interfaces/MessageResponse'
import emojis from './emojis'
import { authController } from './auth'
import { picturesController } from './pictures'
import { subscriptionsController } from './subscriptions'

const router = express.Router()

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/emojis', emojis)

// Auth
router.post('/auth/login', authController.login)
router.post('/auth/register', authController.register)
router.post('/auth/forgot-password', authController.forgotPassword)
router.get('/auth/me', authController.me)

// Pictures
router.post('/pictures/generate', picturesController.generate)
router.post('/pictures/edit', picturesController.edit)
router.get('/pictures/history', picturesController.history)

// Subscriptions
router.get('/subscriptions/list', subscriptionsController.list)
router.post('/subscriptions/buy', subscriptionsController.buy)

export default router
