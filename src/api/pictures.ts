import 'dotenv/config'
import { Request, Response } from 'express'
import { imageGeneratorService } from '../services/imageGeneratorService'
import { userService } from '../services/userService'
import { translationService } from '../services/translationService'
import { openAIService } from '../services/openAIService'

export const picturesController = {
  generate: async (req: Request, res: Response) => {
    const { authorization: auth } = req.headers
    const { type, description, count } = req.body

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

    const credits = userService.getCredits(userId)
    const isFree = credits.createLimit === 0
    console.log('isFree: ', isFree)

    const translated = await translationService.translate(description)
    const translatedDescription = translated.result

    console.log('translatedDescription: ', translatedDescription)

    const promises = Array.from(Array(count)).map(async (x, i) => {
      const cur = isFree
        ? await imageGeneratorService.generate(type, translatedDescription)
        : await openAIService.generate(type, translatedDescription)

      if (!isFree) userService.useCredit(userId, 'create')

      return cur
    })

    const result = await Promise.all(promises)

    result.map((el) => {
      userService.addHistory(userId, 'create', el.image)
    })

    res.json({
      success: true,
      result,
    })
  },
  edit: async (req: Request, res: Response) => {
    const { authorization: auth } = req.headers
    const { image, description } = req.body

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

    const credits = userService.getCredits(userId)
    if (credits.editLimit < 1) {
      res.status(400).json({
        success: false,
        message: 'Not enough credits',
      })

      return
    }

    const result = await imageGeneratorService.edit(image, description)

    userService.useCredit(userId, 'edit')
    userService.addHistory(userId, 'edit', result.image)

    res.json({
      success: true,
      result,
    })
  },
  history: (req: Request, res: Response) => {
    const { authorization: auth } = req.headers

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

    const history = userService.getHistory(userId)

    res.json({
      success: true,
      history,
    })
  },
}
