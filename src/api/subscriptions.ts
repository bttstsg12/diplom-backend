import { Request, Response } from 'express'
import { subscriptionService } from '../services/subscriptionService'
import { userService } from '../services/userService'

export const subscriptionsController = {
  list: (_req: Request, res: Response) => {
    const plans = subscriptionService.getPlans()

    res.json({
      success: true,
      plans,
    })
  },
  buy: (req: Request, res: Response) => {
    const { authorization: auth } = req.headers
    const { planId } = req.body

    if (!auth) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })

      return
    }

    const token = (auth as string).split(' ')[1]

    const userId = userService.getUserByToken(token)

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })

      return
    }

    const plan = subscriptionService.getPlan(planId)

    if (!plan) {
      res.status(400).json({
        success: false,
        message: 'Plan not found',
      })

      return
    }

    userService.addCredits(userId, plan)

    res.json({
      success: true,
      message: 'Plan bought successfully',
    })
  },
}
