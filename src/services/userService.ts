import { v4 } from 'uuid'
import { SubscriptionPlan } from './subscriptionService'

interface User {
  id: number
  username: string
  password: string
}

interface UserData {
  createLimit: number
  editLimit: number
}

const users: Array<User> = []
const subscriptions: Record<number, UserData> = {}
const tokens: Record<string, number> = {}
const histories: Record<
  string,
  Array<{ type: 'create' | 'edit'; image: string }>
> = {}

export const userService = {
  create: (user: Omit<User, 'id'>) => {
    const id = users.length + 1

    users.push({ ...user, id })

    return id
  },
  find: (user: Pick<User, 'username' | 'password'>) => {
    const result = users.find(
      (u) => u.username === user.username && u.password === user.password
    )

    if (!result) {
      return null
    }

    const token = v4()
    tokens[token] = result.id

    return {
      id: result.id,
      token: token,
    }
  },
  findById: (id: number) => {
    return users.find((u) => u.id === id)
  },
  getUserByToken: (token: string) => {
    console.log('tokens: ', tokens, token)
    const result = tokens[token]

    if (!result) {
      return null
    }

    return result
  },
  getPassword: (username: string) => {
    const user = users.find((u) => u.username === username)

    if (!user) {
      return null
    }

    return user.password
  },
  getCredits: (id: number) => {
    if (!subscriptions[id]) {
      return {
        createLimit: 0,
        editLimit: 0,
      }
    }

    return subscriptions[id]
  },
  addCredits: (id: number, plan: SubscriptionPlan) => {
    if (!subscriptions[id]) {
      subscriptions[id] = {
        createLimit: plan.createCount,
        editLimit: plan.editCount,
      }
    } else {
      subscriptions[id].createLimit += plan.createCount
      subscriptions[id].editLimit += plan.editCount
    }
  },
  useCredit: (id: number, type: 'create' | 'edit') => {
    if (!subscriptions[id]) {
      return
    }

    if (type === 'create') {
      subscriptions[id].createLimit--
    } else {
      subscriptions[id].editLimit--
    }
  },
  addHistory: (id: number, type: 'create' | 'edit', image: string) => {
    if (!histories[id]) {
      histories[id] = []
    }

    histories[id].push({ type, image })
  },
  getHistory: (id: number) => {
    return histories[id] || []
  },
}
