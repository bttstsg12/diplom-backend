import { Request, Response } from 'express'
import { userService } from '../services/userService'
import v4 from 'uuid'
export const authController = {
  login: (req: Request, res: Response) => {
    const { username, password } = req.body

    const user = userService.find({ username, password })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    res.json({
      success: true,
      token: user.token,
      id: user.id,
    })
  },
  register: (req: Request, res: Response) => {
    const { username, password } = req.body

    const userId = userService.create({ username, password })

    res.json({
      success: true,
      id: userId,
    })
  },
  forgotPassword: (req: Request, res: Response) => {
    const { username } = req.body
    const password = userService.getPassword(username)

    if (!password) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json({
      success: true,
      password: password,
    })
  },
  me: (req: Request, res: Response) => {
    const { authorization: auth } = req.headers

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const token = (auth as string).split(' ')[1]

    const userId = userService.getUserByToken(token)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const credits = userService.getCredits(userId)
    const user = userService.findById(userId)

    res.json({
      success: true,
      id: userId,
      credits,
      user,
    })
  },
}
