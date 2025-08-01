import {
  getStatus,
  shutdown,
  powerOn,
} from './wakeOnLan.controller.js'

// import { verifyJWT, logger } from '../common/middleware'
import { Router } from 'express'

export const wakeOnLanRouter = Router()

wakeOnLanRouter.get('/wake-on-lan', getStatus)
wakeOnLanRouter.post('/wake-on-lan/shutdown', shutdown)
wakeOnLanRouter.get('/wake-on-lan/powerOn', powerOn)
