import { userService } from './userService'

export interface SubscriptionPlan {
  id: number
  name: string
  price: number
  createCount: number
  editCount: number
  isGood?: boolean
}

const plans: Array<SubscriptionPlan> = [
  { id: 1, name: 'Free', price: 0, createCount: 3, editCount: 1 },
  {
    id: 2,
    name: 'Basic',
    price: 8900,
    createCount: 8,
    editCount: 5,
    isGood: true,
  },
  { id: 3, name: 'Premium', price: 15900, createCount: 20, editCount: 10 },
]

export const subscriptionService = {
  getPlans: () => {
    return plans
  },
  getPlan: (id: number) => {
    return plans.find((el) => el.id === id)
  },
  buy: (id: number, planId: number) => {
    userService.addCredits(id, plans[planId])
  },
}
